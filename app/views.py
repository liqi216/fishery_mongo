from flask import render_template,jsonify,Response,request,make_response,flash,redirect,g
from flask_appbuilder.urltools import *
from flask_appbuilder._compat import as_unicode
from flask_appbuilder import ModelView
from flask_appbuilder.views import MultipleView
from flask_appbuilder.models.mongoengine.interface import MongoEngineInterface
from flask_appbuilder.models.mongoengine.filters import FilterEqual,FilterEqualFunction
from flask_appbuilder.actions import action
from flask_appbuilder.security.mongoengine.models import User,RegisterUser
from mongoengine.queryset.visitor import Q
from app import appbuilder
from flask_appbuilder import BaseView, expose, has_access
from flask_login import current_user
from werkzeug import secure_filename
from wtforms.fields import SelectField,TextField
from app.sec_views import ResetRequestView, ResetPasswordFromRequestView
from app.models import *
from app.rutils import *
from app.fileUtils import *
from app.customize.mongointerface import OtherScenarioMongoEngineInterface, UserOrPublicMongoEngineInterface
from app.customize.views import CopyModelView
from bson import json_util
import pandas as pd
import numpy as np
import json
import datetime
import os
import mongoengine
from decimal import Decimal
from copy import deepcopy
from apscheduler.schedulers.background import BackgroundScheduler
from decimal import *


"""
    Define you Views here
"""

def get_user():
    return current_user.id

class GuestProcessView(ModelView):

    datamodel = MongoEngineInterface(Process)
    list_title = 'List Scenarios'

    list_template = 'list_process_guest.html'

    label_columns = {'guest_pro_name': 'Scenario Name','process_name':'Scenario Name','process_description':'Description','process_public':'Public', 'simple_scenario':'Standard Scenario'}


    base_permissions = ['can_list']

    list_columns = ['guest_pro_name','created_by', 'created_on', 'changed_by', 'changed_on','process_public','simple_scenario']
    formatters_columns = {'created_on': lambda x: x.strftime("%Y-%m-%d %H:%M:%S"),'changed_on': lambda x: x.strftime("%Y-%m-%d %H:%M:%S") }
    base_filters = [['process_public',FilterEqual,True]]
    base_order = ('created_on','desc')


    @expose('/guestProStep/<pk>')
    def guestProStep(self,pk):

        item = self.datamodel.get(pk)

        step1 = ProcessGenInput.objects(process_id=pk).first()

        if step1 is None:
            flash(as_unicode("Could not retrieve inputs from " + item.process_name), 'danger')
            return redirect(url_for('GuestProcessView.list'))

        rndfilenames = []
        stock1_filename = ''

        global_settings = GlobalSettings.objects.first()
        if global_settings is None:
            flash(as_unicode("Could not retrieve inputs" ), 'danger')
            return redirect(url_for('GuestProcessView.list'))

        current_F_ratio = global_settings.extraParam.Current_F_ratio[0]
        current_SSB_ratio = global_settings.extraParam.Current_SSB_ratio[0]
        if step1.stock1_filepath :
            stock1_filename = step1.stock1_filepath.name
        rndfiles = step1.rnd_seed_file
        for file in rndfiles:
            if hasattr(file,'name'):
                rndfilenames.append(file.name)


        #determine if user can edit the inputs in step view
        notEditable = True
        guest = True

        #return appropriate template
        if item.simple_scenario is False:
            return self.render_template('/process_prof.html',process_step1=step1,process_rndfilenames=json.dumps(rndfilenames),process_stock1filename=json.dumps(stock1_filename),process_name=item.process_name, process_description=item.process_description,process_current_F_ratio=current_F_ratio,process_current_SSB_ratio=current_SSB_ratio,notEditable=notEditable,isSimple=item.simple_scenario,guest=guest)
        else:
            return self.render_template('/process_simple.html', process_step1=step1,process_rndfilenames=json.dumps(rndfilenames),process_stock1filename=json.dumps(stock1_filename),process_name=item.process_name, process_description=item.process_description,process_current_F_ratio=current_F_ratio,process_current_SSB_ratio=current_SSB_ratio,notEditable=notEditable,isSimple=item.simple_scenario,guest=guest)

class GuestProcessCmpView(ModelView):

    datamodel = MongoEngineInterface(Process)
    list_template = 'list_compare.html'
    list_title = "MSE Comparison"
    base_permissions = ['can_list']
    formatters_columns = {'created_on': lambda x: x.strftime("%Y-%m-%d %H:%M:%S"),'changed_on': lambda x: x.strftime("%Y-%m-%d %H:%M:%S") }

    label_columns = {'process_name': 'Scenario Name','process_description':'Description','process_public':'Public','simple_scenario':'Standard Scenario'}
    list_columns = ['process_name','created_by', 'created_on', 'changed_by', 'changed_on','simple_scenario']
    base_filters = [['process_public',FilterEqual,True]]
    base_order = ('created_on','desc')

    @action("comparePro","Do Strategy Comparison on these records","Do you really want to?","fa-rocket")
    def comparePro(self, item):
        print("========================")
        print(item)
        print("========================")
        mseNames = []
        mseComp = []
        mseSingleLists = []
        scenarios = []
        differences = {}

        for process in item:
            pgi = ProcessGenInput.objects(process_id=process.id).first()
            result = MseResultList.objects(process_gen_id=str(pgi.id)).first()
            if result is None:
                flash(as_unicode("No MSE result created yet for " + process.process_name), 'danger')
                return redirect(url_for('ProcessCmpView.list'))
            print(result)
            #get names
            mseNames.append(process.process_name)
            mse_dict = json.loads(result.to_json())
            
            #get single list 
            mseSingleLists.append(mse_dict['resultlist'])

            #get list of fields that are used for graphs in mse comparison page
            mseComp.append(mse_dict['mseCompFields'])
            scenarios.append(json.loads(pgi.to_json()))

        #Get a dict of parameters that differ from scenarios
        if  len(scenarios) > 0:
            exclude = ['_id','process_id', 'created_by','created_on','changed_by','changed_on']
            for key, value in scenarios[0].items():
                if key not in exclude:
                    for scenario in scenarios:
                        val = None
                        #check if key exists
                        if key in scenario:
                            val = scenario[key]
                            #if values dont match, add value list to dict
                            if val != value:
                                differences[key] = True
                        else:
                            #add values list to dict
                            differences[key] = True
        """
            do something with the item record
        """
        return self.render_template('/stgCompare_guest.html',mseNames=json.dumps(mseNames),mseComp=json.dumps(mseComp),mseSingleLists=json.dumps(mseSingleLists),differences=differences, differences_str=json.dumps(differences),items=scenarios,scenarios=json.dumps(scenarios),scenarioNames=mseNames)

class ProcessView(CopyModelView):

    datamodel = MongoEngineInterface(Process)
    list_title = 'List Your Scenarios'

    list_template = 'list_process_editable.html'

    label_columns = {'pro_name': 'Scenario Name','process_name':'Scenario Name','process_description':'Description','process_public':'Public', 'simple_scenario':'Standard Scenario'}
    add_columns =  ['process_name','process_description', 'simple_scenario']
    edit_columns =  ['process_name','process_description']
    list_columns = ['pro_name','process_description', 'created_by', 'created_on', 'changed_by', 'changed_on','is_public','simple_scenario']
    formatters_columns = {'created_on': lambda x: x.strftime("%Y-%m-%d %H:%M:%S"),'changed_on': lambda x: x.strftime("%Y-%m-%d %H:%M:%S") }
    base_order = ('process_public','desc')
    base_filters = [['created_by', FilterEqualFunction, get_user]]

    def pre_add(self, item):
        # check if passed limit for scenarios
        if current_user.roles[0].name != 'Admin' and Process.objects(Q(created_by=current_user.id)).count() >= 20:
            raise Exception('Unable to add scenario, max 20 scenarios reached')
        #check if current user already has scenario with the same name
        if Process.objects(Q(created_by=current_user.id) & Q(process_name=item.process_name)):
            raise Exception('You have already created a scenario with the same name')

        if GlobalSettings.objects.first() == None:
            raise Exception('Could not get default values from global settings')
        print("add sce")
        item.created_by = current_user.id
        item.changed_by = current_user.id
        item.process_public = False

    def pre_update(self, item):
        #check if current user already has scenario with the same name
        if Process.objects(Q(created_by=current_user.id) & Q(process_name=item.process_name) & Q(id__ne=item.id)):
            raise Exception('You already have a scenario with the same name')
        item.changed_by = current_user.id
        item.changed_on = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    def pre_delete(self, item):

        if current_user.roles[0].name == 'Admin':
            step1 = ProcessGenInput.objects(process_id=item.id).first()
            step1.delete()
        
        elif item.created_by.id != current_user.id and current_user.roles[0].name != 'Admin':
            raise Exception('Can only delete your own Scenarios')
        else:
            step1 = ProcessGenInput.objects(process_id=item.id).first()
            step1.delete()
        
            

    def post_add(self, item):
        step1 = self.initializePGI(item)
        rndfilenames = []
        stock1_filename = None
        if step1.stock1_filepath :
            stock1_filename = step1.stock1_filepath.name
        print("===================")
        print(stock1_filename)
        print("===================")
        rndfiles = step1.rnd_seed_file
        for file in rndfiles:
            if hasattr(file,'name'):
                rndfilenames.append(file.name)

    def initializePGI(self,item):
        step1 = ProcessGenInput.objects(process_id=item.id).first()

        if step1 is None:
            print("step1 is null")
            #############################################################
            #   read from global_settings                               #
            #############################################################

            step1 = ProcessGenInput(process_id=item.id,created_by=current_user.id)
            step1.initDefaults()

            #extral
            #step1.extra_F = global_settings.extra_F

            #add default rnd file
            rndfile = open(os.path.join(os.path.dirname(__file__),'static/csv/seed.csv'),'rb')
            onefile = mongoengine.fields.GridFSProxy()
            onefile.put(rndfile,content_type='csv',filename = 'seed.csv')
            step1.rnd_seed_file.append(onefile)
            step1.save()

        return step1



    @expose('/showProStep/<pk>')
    @has_access
    def showProStep(self,pk):

        item = self.datamodel.get(pk)
        global_settings = GlobalSettings.objects.first()

        step1 = self.initializePGI(item)

        rndfilenames = []
        stock1_filename = None
        if step1.stock1_filepath :
            stock1_filename = step1.stock1_filepath.name
        print("===================")
        print(stock1_filename)
        print("===================")
        rndfiles = step1.rnd_seed_file
        for file in rndfiles:
            if hasattr(file,'name'):
                rndfilenames.append(file.name)

        current_F_ratio = global_settings.extraParam.Current_F_ratio[0]
        current_SSB_ratio = global_settings.extraParam.Current_SSB_ratio[0]

        #fix mean, SSB0, R0, and, steepness
        step1.hst1_mean = global_settings.hst1_mean
        step1.hst1_mean_early = global_settings.hst1_mean_early
        step1.fml1MbhmSSB0 = global_settings.fml1MbhmSSB0
        step1.fml1MbhmR0 = global_settings.fml1MbhmR0
        step1.fml1MbhmR0_early = global_settings.fml1MbhmR0_early
        step1.fml1MbhmSteep = global_settings.fml1MbhmSteep
        step1.save()

        #determine if user can edit the inputs in step view
        notEditable = True
        try:
            if current_user.id == item.created_by.id or current_user.roles[0].name == "Admin":
                notEditable = False
        except:
            notEditable = False

        #return appropriate template
        if item.simple_scenario is False:
            return self.render_template('/process_prof.html',process_step1=step1,process_rndfilenames=json.dumps(rndfilenames),process_stock1filename=json.dumps(stock1_filename),process_name=item.process_name, process_description=item.process_description,process_current_F_ratio=current_F_ratio,process_current_SSB_ratio=current_SSB_ratio,notEditable=notEditable,isSimple=item.simple_scenario)
        else:
            return self.render_template('/process_simple.html', process_step1=step1,process_rndfilenames=json.dumps(rndfilenames),process_stock1filename=json.dumps(stock1_filename),process_name=item.process_name, process_description=item.process_description,process_current_F_ratio=current_F_ratio,process_current_SSB_ratio=current_SSB_ratio,notEditable=notEditable,isSimple=item.simple_scenario)

class ProcessViewOther(ProcessView):
    base_filters = []
    list_title = 'List Other Public Scenarios'
    datamodel = OtherScenarioMongoEngineInterface(Process)

    def _get_view_widget(self, **kwargs):
        """
         overriding method
            :return:
                returns widgets dict
        """
        return self._list()

class ProcessCmpView(ModelView):

    datamodel = UserOrPublicMongoEngineInterface(Process)
    list_template = 'list_compare.html'
    list_title = "MSE Comparison"
    base_permissions = ['can_list']
    formatters_columns = {'created_on': lambda x: x.strftime("%Y-%m-%d %H:%M:%S"),'changed_on': lambda x: x.strftime("%Y-%m-%d %H:%M:%S") }
    label_columns = {'process_name': 'Scenario Name','process_description':'Description','process_public':'Public', 'simple_scenario':'Standard Scenario'}
    list_columns = ['process_name','process_description', 'created_by', 'created_on', 'changed_by', 'changed_on','simple_scenario']

    @action("comparePro","Do Strategy Comparison on these records","Do you really want to?","fa-rocket")
    def comparePro(self, item):
        print("========================")
        print(item)
        print("========================")
        mseNames = []
        mseComp = []
        mseSingleLists = []
        scenarios = []
        differences = {}

        for process in item:
            pgi = ProcessGenInput.objects(process_id=process.id).first()
            result = MseResultList.objects(process_gen_id=str(pgi.id)).first()
            if result is None:
                flash(as_unicode("No MSE result created yet for " + process.process_name), 'danger')
                return redirect(url_for('ProcessCmpView.list'))
            print(result)
            #get names
            mseNames.append(process.process_name)
            mse_dict = json.loads(result.to_json())
            
            #get single list 
            mseSingleLists.append(mse_dict['resultlist'])

            #get list of fields that are used for graphs in mse comparison page
            mseComp.append(mse_dict['mseCompFields'])
            scenarios.append(json.loads(pgi.to_json()))

        #Get a dict of parameters that differ from scenarios
        if  len(scenarios) > 0:
            exclude = ['_id','process_id', 'created_by','created_on','changed_by','changed_on']
            for key, value in scenarios[0].items():
                if key not in exclude:
                    for scenario in scenarios:
                        val = None
                        #check if key exists
                        if key in scenario:
                            val = scenario[key]
                            #if values dont match, add value list to dict
                            if val != value:
                                differences[key] = True
                        else:
                            #add values list to dict
                            differences[key] = True

                    

                    
                    
            
        """
            do something with the item record
        """
        return self.render_template('/stgCompare.html',mseNames=json.dumps(mseNames),mseComp=json.dumps(mseComp),mseSingleLists=json.dumps(mseSingleLists),differences=differences, differences_str=json.dumps(differences),items=scenarios,scenarios=json.dumps(scenarios),scenarioNames=mseNames)



class AdvancedMseView(ModelView):
    #route_base = "/advancedmseview"

    datamodel = UserOrPublicMongoEngineInterface(Process)
    list_template = 'advanced_process.html'
    list_title = "Advanced MSE"
    base_permissions = ['can_list']
    formatters_columns = {'created_on': lambda x: x.strftime("%Y-%m-%d %H:%M:%S"),'changed_on': lambda x: x.strftime("%Y-%m-%d %H:%M:%S") }

    label_columns = {'process_name' : 'Scenario Name','process_description':'Description','process_public':'Public', 'simple_scenario':'Standard Scenario'}
    list_columns = ['advance_compare','process_name','process_description', 'created_by', 'created_on', 'changed_by', 'changed_on','simple_scenario']
    
    @expose('/advcalc', methods = ['POST'])
    def advcalc(self):
        if request.method == 'POST':
            data = request.form.to_dict()
            keys = data.keys()
            if 'fChk' in keys:
                fMin = float(data['fMin'])
                fMax = float(data['fMax'])
                fLevel = int(data['fLevel'])
                F = True
            if 'sChk' in keys:
                sMin = float(data['sMin'])
                sMax = float(data['sMax'])
                sLevel = int(data['sLevel'])
                S=True
            if 'aChk' in keys:
                aMin = float(data['aMin'])
                aMax = float(data['aMax'])
                aLevel = int(data['aLevel'])
                A = True
            print(data)
            pk = data['package_selected']
            return Response(json.dumps({'status':1}), mimetype='application/json')

class ProStepView(BaseView):

    route_base = "/prostepview"

    ALLOWED_RND_EXTENSIONS = set(['csv'])

    def allowed_file(self,filename):
        return '.' in filename and \
            filename.rsplit('.', 1)[1].lower() in self.ALLOWED_RND_EXTENSIONS

    #process step1 : general inputs
    @expose('/step1/<string:pk>', methods = ['PUT'])
    @has_access
    def step1(self,pk):
        if request.method == 'PUT':
            pgi = ProcessGenInput.objects(id=pk).first()
            data = request.get_json()

            """
            pgi.time_step = request.form["time_step"]
            pgi.start_projection = request.form["start_projection"]
            """
            pgi.short_term_mgt = data['short_term_mgt']
            pgi.long_term_mgt = data['long_term_mgt']
            """
            pgi.long_term_unit = request.form["long_term_unit"]
            pgi.short_term_unit = request.form["short_term_unit"]
            pgi.stock_per_mgt_unit = request.form["stock_per_mgt_unit"]
            pgi.mixing_pattern = request.form["mixing_pattern"]
            pgi.last_age = request.form["last_age"]
            """
            pgi.observ_err_EW_stock = data['observ_err_EW_stock']
            pgi.no_of_interations = data['no_of_interations']
            pgi.sample_size = data['sample_size']

            pgi.rnd_seed_setting = data['rnd_seed_setting']
            pgi.save()

        return Response(json.dumps({'status':1}), mimetype='application/json')

    #process mixing pattern, not used yet
    @expose('/step2/<string:pk>', methods = ['PUT'])
    @has_access
    def step2(self,pk):
        if request.method == 'PUT':
            pgi = ProcessGenInput.objects(id=pk).first()
            pgi.unit1to1 = request.form["unit1to1"]
            pgi.unit1to2 = request.form["unit1to2"]
            pgi.unit2to1 = request.form["unit2to1"]
            pgi.unit2to2 = request.form["unit2to2"]
            pgi.save()

        return Response(json.dumps({'status':1}), mimetype='application/json')

    #process stock assessment
    @expose('/step3/<string:pk>', methods = ['PUT'])
    @has_access
    def step3(self,pk):
        populist = {}
        if request.method == 'PUT':
            pgi = ProcessGenInput.objects(id=pk).first()
            pgi.stock1_input_file_type = request.form["stock1_input_file_type"]
            pgi.save()

        #return jsonify(pgi.to_json())
        return Response(pgi.to_json(), mimetype='application/json')

    #process Initial Population
    @expose('/step4/<string:pk>', methods = ['PUT'])
    @has_access
    def step4(self,pk):
        if request.method == 'PUT':
            pgi = ProcessGenInput.objects(id=pk).first()
            inputparam = request.get_json()

            pgi.ip_cv_1 = float(inputparam['ip_cv_1']);
            pgi.ip_cv_2 = float(inputparam['ip_cv_2']);

            originlist = inputparam['initPopu']

            populist = []

            for popu in originlist:
                inipopu = GIIniPopulation()
                inipopu.age_1 = int(popu['age_1'])
                inipopu.stock_1_mean = float(popu['stock_1_mean'])
                inipopu.cv_1 = float(popu['cv_1'])
                inipopu.stock_2_mean = float(popu['stock_2_mean'])
                inipopu.cv_2 = float(popu['cv_2'])
                populist.append(inipopu)
            pgi.iniPopu = populist
            pgi.save()

        return Response(json.dumps({'status':1}), mimetype='application/json')

    #process Biological Parameters
    @expose('/step5/<string:pk>', methods = ['PUT'])
    @has_access
    def step5(self,pk):
        if request.method == 'PUT':
            pgi = ProcessGenInput.objects(id=pk).first()
            originlist = request.get_json()
            biolist = []

            for origin in originlist:
                bioparam = BioParameter()
                bioparam.age_1 = int(origin['age_1'])
                bioparam.weight_at_age_1 = float(origin['weight_at_age_1'])
                bioparam.fec_at_age_1 = float(origin['fec_at_age_1'])
                bioparam.weight_at_age_2 = float(origin['weight_at_age_2'])
                bioparam.fec_at_age_2 = float(origin['fec_at_age_2'])
                biolist.append(bioparam)

            pgi.bioParam = biolist
            pgi.save()
        return Response(json.dumps({'status':1}), mimetype='application/json')

    #process Natural Mortality
    @expose('/step6/<string:pk>', methods = ['PUT'])
    @has_access
    def step6(self,pk):
        if request.method == 'PUT':
            pgi = ProcessGenInput.objects(id=pk).first()
            inputparam = request.get_json()

            pgi.mortality_complexity = int(inputparam['mortality_complexity']);
            pgi.nm_m = inputparam['nm_m'];
            pgi.nm_cv_1 = float(inputparam['nm_cv_1']);
            pgi.nm_cv_2 = float(inputparam['nm_cv_2']);

            mortalitylist = inputparam['mortality']

            morlist = []

            for origin in mortalitylist:
                morParam = Mortality()
                morParam.age_1 = int(origin['age_1'])
                morParam.mean_1 = float(origin['mean_1'])
                morParam.cv_mean_1 = float(origin['cv_mean_1'])
                morParam.mean_2 = float(origin['mean_2'])
                morParam.cv_mean_2 = float(origin['cv_mean_2'])
                morlist.append(morParam)

            pgi.mortality = morlist
            pgi.save()

        return Response(json.dumps({'status':1}), mimetype='application/json')

    #process Recruitment
    @expose('/step7/<string:pk>', methods = ['PUT'])
    @has_access
    def step7(self,pk):
        if request.method == 'PUT':
            pgi = ProcessGenInput.objects(id=pk).first()
            inputparam = request.get_json()


            pgi.simple_spawning = float(inputparam['simple_spawning']);
            pgi.cvForRecu = inputparam['cvForRecu']
            pgi.stock1_amount = inputparam['stock1_amount']
            pgi.stock2_amount = inputparam['stock2_amount']
            pgi.recruitTypeStock1 = inputparam['recruitTypeStock1']
            pgi.fromHisStock1 = inputparam['fromHisStock1']

            pgi.historySt1 = inputparam['historySt1']
            pgi.hst1_mean = inputparam['hst1_mean']
            pgi.hst1_other = inputparam['hst1_other']
            pgi.hst1_cal = inputparam['hst1_cal']

            pgi.historySt1_early = inputparam['historySt1_early']
            pgi.hst1_mean_early = inputparam['hst1_mean_early']
            pgi.hst1_other_early = inputparam['hst1_other_early']
            pgi.hst1_cal_early = inputparam['hst1_cal_early']

            pgi.formulaStock1 = inputparam['formulaStock1']
            pgi.fromFmlStock1 = inputparam['fromFmlStock1']
            pgi.fml1MbhmSSB0 = inputparam['fml1MbhmSSB0']
            pgi.fml1MbhmR0 = inputparam['fml1MbhmR0']
            pgi.fml1MbhmSteep = inputparam['fml1MbhmSteep']
            pgi.fml1MbhmR0_early = inputparam['fml1MbhmR0_early']

            pgi.save()

        return Response(json.dumps({'status':1}), mimetype='application/json')

    #get Rhist from global GlobalSetting to calculate percentile in Recruitment
    @expose('/calc' , methods = ['POST'])
    @has_access
    def calc(self):
        if request.method == 'POST':
            global_settings = GlobalSettings.objects.first()
            data = request.get_json()
            percentile = float(data['percentile'])
            isEarly = data['early'];
            Rhist = []
            result = 0

            if isEarly == True:
                Rhist = global_settings.hst1_early
                result = np.percentile(Rhist, percentile)
            else:
                Rhist = global_settings.hst1
                result = np.percentile(Rhist, percentile)

            return Response(json.dumps({'result':result}), mimetype='application/json')






    #process Management 1
    @expose('/step8/<string:pk>', methods = ['PUT'])
    @has_access
    def step8(self,pk):
        if request.method == 'PUT':
            pgi = ProcessGenInput.objects(id=pk).first()
            inputparam = request.get_json()

            #pgi.bio_f_percent = float(inputparam['bio_f_percent'])/0.75;
            pgi.harvest_level = float(inputparam['harvest_level']);
            pgi.mg1_cv = inputparam['mg1_cv'];

            pgi.save()

        return Response(json.dumps({'status':1}), mimetype='application/json')

    #process Management 2
    @expose('/step9/<string:pk>', methods = ['PUT'])
    @has_access
    def step9(self,pk):
        if request.method == 'PUT':
            pgi = ProcessGenInput.objects(id=pk).first()
            inputparam = request.get_json()

            pgi.sec_commercial = inputparam['sec_commercial'];
            pgi.sec_recreational = inputparam['sec_recreational'];
            pgi.sec_headboat = inputparam['sec_headboat'];
            pgi.sec_charterboat = inputparam['sec_charterboat'];
            pgi.sec_hire = inputparam['sec_hire'];
            pgi.sec_private = inputparam['sec_private'];
            pgi.sec_pstar = inputparam['sec_pstar'];
            pgi.sec_act_com = inputparam['sec_act_com'];
            pgi.sec_act_pri = inputparam['sec_act_pri'];
            pgi.sec_act_hire = inputparam['sec_act_hire'];
            pgi.p_e = inputparam['p_e'];
            pgi.p_w = inputparam['p_w'];

            pgi.save()

        return Response(json.dumps({'status':1}), mimetype='application/json')

    #Management 7
    @expose('/stateQuotas/<string:pk>', methods = ['PUT'])
    @has_access
    def stateQuotas(self,pk):
        if request.method == 'PUT':
            pgi = ProcessGenInput.objects(id=pk).first()
            inputparam = request.get_json()

            pgi.louisiana = inputparam['louisiana'];
            pgi.mississippi = inputparam['mississippi'];
            pgi.alabama = inputparam['alabama'];
            pgi.texas = inputparam['texas'];
            pgi.florida = inputparam['florida'];
            pgi.save()

        return Response(json.dumps({'status':1}), mimetype='application/json')

    #process Management 3
    @expose('/step10/<string:pk>', methods = ['PUT'])
    @has_access
    def step10(self,pk):
        if request.method == 'PUT':
            pgi = ProcessGenInput.objects(id=pk).first()

            inputparam = request.get_json()

            pgi.mg3_commercial = inputparam['mg3_commercial'];
            pgi.mg3_recreational = inputparam['mg3_recreational'];
            pgi.mg3_forhire = inputparam['mg3_forhire'];
            pgi.mg3_private = inputparam['mg3_private'];

            pgi.est_fed_forhire = inputparam['est_fed_forhire']
            pgi.est_AL_private = inputparam['est_AL_private']
            pgi.est_FL_private = inputparam['est_FL_private']
            pgi.est_LA_private = inputparam['est_LA_private']
            pgi.est_MS_private = inputparam['est_MS_private']
            pgi.est_MS_forhire = inputparam['est_MS_forhire']
            pgi.est_TX_private = inputparam['est_TX_private']
            pgi.est_TX_forhire = inputparam['est_TX_forhire']

            pgi.save()

        return Response(json.dumps({'status':1}), mimetype='application/json')


    #process Management 4
    @expose('/step10_2/<string:pk>', methods = ['PUT'])
    @has_access
    def step10_2(self,pk):
        if request.method == 'PUT':
            pgi = ProcessGenInput.objects(id=pk).first()

            inputparam = request.get_json()

            pgi.mg3_rec_east_open = inputparam['rec_east_open'];
            pgi.mg3_rec_east_closed = inputparam['rec_east_closed'];
            pgi.mg3_rec_west_open = inputparam['rec_west_open'];
            pgi.mg3_rec_west_closed = inputparam['rec_west_closed'];
            pgi.mg3_comhard_east_open = inputparam['comhard_east_open'];
            pgi.com_stock1_closed = inputparam['com_stock1_closed'];
            pgi.mg3_comhard_west_open = inputparam['comhard_west_open'];
            pgi.com_stock2_closed = inputparam['com_stock2_closed'];
            pgi.mg3_comlong_east_open = inputparam['comlong_east_open'];
            pgi.mg3_comlong_west_open = inputparam['comlong_west_open'];

            pgi.save()

        return Response(json.dumps({'status':1}), mimetype='application/json')

    #process Management 5
    @expose('/step11/<string:pk>', methods = ['PUT'])
    @has_access
    def step11(self,pk):
        if request.method == 'PUT':
            pgi = ProcessGenInput.objects(id=pk).first()

            inputparam = request.get_json()

            pgi.base_fed_forhire = inputparam['base_fed_forhire'];
            pgi.base_AL_private = inputparam['base_AL_private'];
            pgi.base_FL_private = inputparam['base_FL_private'];
            pgi.base_LA_private = inputparam['base_LA_private'];
            pgi.base_MS_private = inputparam['base_MS_private'];
            pgi.base_MS_forhire = inputparam['base_MS_forhire'];
            pgi.base_TX_private = inputparam['base_TX_private'];
            pgi.base_TX_forhire = inputparam['base_TX_forhire'];
            pgi.est_fed_forhire = inputparam['est_fed_forhire'];
            pgi.est_AL_private = inputparam['est_AL_private'];
            pgi.est_FL_private = inputparam['est_FL_private'];
            pgi.est_LA_private = inputparam['est_LA_private'];
            pgi.est_MS_private = inputparam['est_MS_private'];
            pgi.est_MS_forhire = inputparam['est_MS_forhire'];
            pgi.est_TX_private = inputparam['est_TX_private'];
            pgi.est_TX_forhire = inputparam['est_TX_forhire'];
            pgi.season_fed_forhire = inputparam['season_fed_forhire'];
            pgi.season_private = inputparam['season_private'];
            pgi.fed_forhire_length = inputparam['fed_forhire_length'];
            pgi.AL_private_length = inputparam['al_private_length'];
            pgi.FL_private_length = inputparam['fl_private_length'];
            pgi.LA_private_length = inputparam['la_private_length'];
            pgi.MS_private_length = inputparam['ms_private_length'];
            pgi.MS_forhire_length = inputparam['ms_forhire_length'];
            pgi.TX_private_length = inputparam['tx_private_length'];
            pgi.TX_forhire_length = inputparam['tx_forhire_length'];

            pgi.save()

        return Response(json.dumps({'status':1}), mimetype='application/json')

    #step Management 6
    @expose('/step12/<string:pk>', methods=['PUT'])
    @has_access
    def step12(self,pk):
        if request.method == 'PUT':
            pgi = ProcessGenInput.objects(id=pk).first()
            inputparam = request.get_json()

            pgi.penalty_switch = inputparam['penalty_switch']
            pgi.carryover_switch = inputparam['carryover_switch']

            pgi.save()
        return Response(json.dumps({'status':1}), mimetype='application/json')

    @expose('/resetValues/<string:pk>', methods=['PUT'])
    @has_access
    def resetValues(self,pk):
        if request.method == 'PUT':
            pgi = ProcessGenInput.objects(id=pk).first()
            pgi.initDefaults()

            pgi.save()
        return Response(json.dumps({'status':1}), mimetype='application/json')


    ##############################################################################################
    # process step1 : rnd file upload, keep it for future use, implemented multiple files upload #
    ##############################################################################################
    @expose('/rndSeedFile/<string:pk>', methods = ['POST','DELETE'])
    @has_access
    def uploadRndSeedFile(self,pk):
        #app_stack = _app_ctx_stack or _request_ctx_stack
        #ctx = app_stack.top

        pgi = ProcessGenInput.objects(id=pk).first()
        pgi.update(changed_by=current_user.id,changed_on=datetime.datetime.now)

        if request.method == 'POST':
            files = request.files['file']

            if files:
                filename = secure_filename(files.filename)

                mime_type = files.content_type

                if not self.allowed_file(files.filename):
                    result = uploadfile(name=filename, type=mime_type, size=0, not_allowed_msg="File type not allowed")
                else:
                    onefile = mongoengine.fields.GridFSProxy()
                    onefile.put(files,content_type = mime_type,filename = files.filename)
                    pgi.rnd_seed_file.append(onefile)
                    #pgi.rnd_seed_file.replace(files,content_type = 'csv',filename = files.filename)
                    pgi.save()
                    #rnd = pgi.rnd_seed_file.read()
                    #print(pgi.rnd_seed_file.filename)
                    #print(pgi.rnd_seed_file.content_type)

        if request.method == 'DELETE':
            filename = request.get_json()['filename']
            for file in pgi.rnd_seed_file:
                if hasattr(file,'name'):
                    if filename==file.name:
                        file.delete()
                        pgi.rnd_seed_file.pop(file_index)
                        pgi.save()
                    #ProcessGenInput.objects(id=pk).update_one(pull__rnd_seed_file=file)

        return json.dumps({})

    #######################################################################################
    # keep it for future use, implemented multiple files upload                           #
    #######################################################################################
    @expose('/rndSeedFile/download/<pk>/<filename>')
    @has_access
    def download(self, pk, filename):
        item = ProcessGenInput.objects(id=pk).first()
        for file in item.rnd_seed_file:
            if(filename==file.name):
                response = make_response(file.read())
                response.headers["Content-Disposition"] = "attachment; filename={0}".format(filename)
                response.mimetype = 'text/csv'
                return response

    #######################################################################################
    # keep it for future use, implemented single file upload                              #
    #######################################################################################

    #process step3 : stock1 file upload
    @expose('/stock1file/<string:pk>', methods = ['POST','DELETE'])
    @has_access
    def uploadStock1File(self,pk):
        #app_stack = _app_ctx_stack or _request_ctx_stack
        #ctx = app_stack.top

        pgi = ProcessGenInput.objects(id=pk).first()
        pgi.update(changed_by=current_user.id,changed_on=datetime.datetime.now)

        if request.method == 'POST':
            files = request.files['file']

            if files:
                filename = secure_filename(files.filename)

                mime_type = files.content_type
                '''
                if not self.allowed_file(files.filename):
                    result = uploadfile(name=filename, type=mime_type, size=0, not_allowed_msg="File type not allowed")
                else:
                    pgi.stock1_filepath.replace(files,content_type = 'csv',filename = files.filename)
                    pgi.save()
                '''
                pgi.stock1_filepath.replace(files,content_type = mime_type,filename = files.filename)
                pgi.save()

        if request.method == 'DELETE':
            pgi.stock1_filepath.delete()

        return json.dumps({})

    #######################################################################################
    # keep it for future use, implemented single file upload                              #
    #######################################################################################

    @expose('/stock1file/download/<pk>')
    @has_access
    def downloadStock1File(self, pk):
        item = ProcessGenInput.objects(id=pk).first()
        file = item.stock1_filepath.read()
        response = make_response(file)
        response.headers["Content-Disposition"] = "attachment; filename={0}".format(item.stock1_filepath.filename)
        response.mimetype = item.stock1_filepath.content_type
        return response

    @expose('/getIniPopuTableData/<pk>')
    @has_access
    def getIniPopuTableData(self,pk):

        pgi = ProcessGenInput.objects(id=pk).first()
        if pgi.iniPopu != None and len(pgi.iniPopu)>0:
            return Response(pgi.to_json(), mimetype='application/json')

        else:
            global_settings = GlobalSettings.objects.first()

            pgi.iniPopu = global_settings.iniPopu

            pgi.save()

            return Response(pgi.to_json(), mimetype='application/json')

    @expose('/getBioParamTableData/<pk>')
    @has_access
    def getBioParamTableData(self,pk):

        pgi = ProcessGenInput.objects(id=pk).first()

        if pgi.bioParam != None and len(pgi.bioParam)>0:
            return Response(pgi.to_json(), mimetype='application/json')

        else:
            global_settings = GlobalSettings.objects.first()

            pgi.bioParam = global_settings.bioParam

            pgi.save()

            return Response(pgi.to_json(), mimetype='application/json')

    @expose('/getMortalityTableData/<pk>')
    @has_access
    def getMortalityTableData(self,pk):

        pgi = ProcessGenInput.objects(id=pk).first()

        if pgi.mortality != None and len(pgi.mortality)>0:
            return Response(pgi.to_json(), mimetype='application/json')

        else:
            global_settings = GlobalSettings.objects.first()

            pgi.mortality = global_settings.mortality

            pgi.save()

            return Response(pgi.to_json(), mimetype='application/json')

    @expose('/editTableData', methods = ['POST'])
    @has_access
    def editTableData(self):

        print(request.form["stock_1_mean"])

        return Response(json.dumps({'status':1}), mimetype='application/json')

    @expose('/getEchartData')
    @has_access
    def getEchartData(self):

        file_data = 'static/csv/F by Fleet.csv'

        df_E = pd.read_csv(os.path.join(os.path.dirname(__file__),file_data),usecols=['Yr','F_std','HL_E','HL_W'])

        return Response(df_E.to_json(orient='records'), mimetype='application/json')

    @expose('/getSsbAndFEchart')
    @has_access
    def getSsbAndFEchart(self):

        file_data = 'static/csv/ssbF.csv'

        df_E = pd.read_csv(os.path.join(os.path.dirname(__file__),file_data),usecols=['plot_years','plot_ssb','plot_F'])

        return Response(df_E.to_json(orient='records'), mimetype='application/json')

    @expose('/getMseInfo/<string:pid>')
    @has_access
    def getMseInfo(self,pid):

        pgi = ProcessGenInput.objects(process_id=pid).first()
        print(pgi)

        return Response(pgi.to_json(), mimetype='application/json')

    @expose('/propublic/<string:pk>', methods = ['PUT'])
    @has_access
    def propublic(self,pk):

        prs = Process.objects(id=pk).first()
        #if is registered user
        if request.form["public"]=='true'and current_user.roles[0].name == 'Registered User':
            #if user wants to make a 3rd process public
            if Process.objects(Q(created_by=current_user.id)&Q(process_public=True)).count() == 2:
                #check confirmation response from user before making public
                if request.form["confirm"] == 'true':
                    prs.process_public = True if request.form["public"]=='true' else False
                    prs.save()
                    return Response(json.dumps({'status': 1}), mimetype='application/json')
                else:
                    #ask user to confirm
                    return Response(json.dumps({'status': 2}), mimetype='application/json')
            #user already has 3 or more process public, notify user
            elif Process.objects(Q(created_by=current_user.id)&Q(process_public=True)).count() >= 3:
                return Response(json.dumps({'status': 3}), mimetype='application/json')

        #request from admin or attempt to make public false are saved with no problem
        if request.form["public"]:
            prs.process_public = True if request.form["public"]=='true' else False
        prs.save()
        return Response(json.dumps({'status':1}), mimetype='application/json')

    @expose('/prosimple/<string:pk>', methods = ['PUT'])
    @has_access
    def prosimple(self,pk):

        prs = Process.objects(id=pk).first()
        if request.form["simple"]:
            prs.process_simple = True if request.form["simple"]=='true' else False
        prs.save()
        return Response(json.dumps({'status':1}), mimetype='application/json')

    @expose('/setDefault/<string:pk>', methods = ['PUT'])
    @has_access
    def setDefault(self,pk):

        stockFile = StockFile.objects(id=pk).first()

        oldDefault = StockFile.objects(default_file=True).first()

        if oldDefault != None:
            oldDefault.default_file = False
            oldDefault.save()

        print(stockFile)

        stockFile.default_file = True
        stockFile.save()
        return Response(json.dumps({'status':1}), mimetype='application/json')


class ProStepView(BaseView):

    route_base = "/prostepview"

    ALLOWED_RND_EXTENSIONS = set(['csv'])

    def allowed_file(self,filename):
        return '.' in filename and \
            filename.rsplit('.', 1)[1].lower() in self.ALLOWED_RND_EXTENSIONS

    #process step1 : general inputs
    @expose('/step1/<string:pk>', methods = ['PUT'])
    @has_access
    def step1(self,pk):
        if request.method == 'PUT':
            pgi = ProcessGenInput.objects(id=pk).first()
            data = request.get_json()

            """
            pgi.time_step = request.form["time_step"]
            pgi.start_projection = request.form["start_projection"]
            """
            pgi.short_term_mgt = data['short_term_mgt']
            pgi.long_term_mgt = data['long_term_mgt']
            """
            pgi.long_term_unit = request.form["long_term_unit"]
            pgi.short_term_unit = request.form["short_term_unit"]
            pgi.stock_per_mgt_unit = request.form["stock_per_mgt_unit"]
            pgi.mixing_pattern = request.form["mixing_pattern"]
            pgi.last_age = request.form["last_age"]
            """
            pgi.observ_err_EW_stock = data['observ_err_EW_stock']
            pgi.no_of_interations = data['no_of_interations']
            pgi.sample_size = data['sample_size']

            pgi.rnd_seed_setting = data['rnd_seed_setting']
            pgi.save()

        return Response(json.dumps({'status':1}), mimetype='application/json')

    #process mixing pattern, not used yet
    @expose('/step2/<string:pk>', methods = ['PUT'])
    @has_access
    def step2(self,pk):
        if request.method == 'PUT':
            pgi = ProcessGenInput.objects(id=pk).first()
            pgi.unit1to1 = request.form["unit1to1"]
            pgi.unit1to2 = request.form["unit1to2"]
            pgi.unit2to1 = request.form["unit2to1"]
            pgi.unit2to2 = request.form["unit2to2"]
            pgi.save()

        return Response(json.dumps({'status':1}), mimetype='application/json')

    #process stock assessment
    @expose('/step3/<string:pk>', methods = ['PUT'])
    @has_access
    def step3(self,pk):
        populist = {}
        if request.method == 'PUT':
            pgi = ProcessGenInput.objects(id=pk).first()
            pgi.stock1_input_file_type = request.form["stock1_input_file_type"]
            pgi.save()

        #return jsonify(pgi.to_json())
        return Response(pgi.to_json(), mimetype='application/json')

    #process Initial Population
    @expose('/step4/<string:pk>', methods = ['PUT'])
    @has_access
    def step4(self,pk):
        if request.method == 'PUT':
            pgi = ProcessGenInput.objects(id=pk).first()
            inputparam = request.get_json()

            pgi.ip_cv_1 = float(inputparam['ip_cv_1']);
            pgi.ip_cv_2 = float(inputparam['ip_cv_2']);

            originlist = inputparam['initPopu']

            populist = []

            for popu in originlist:
                inipopu = GIIniPopulation()
                inipopu.age_1 = int(popu['age_1'])
                inipopu.stock_1_mean = float(popu['stock_1_mean'])
                inipopu.cv_1 = float(popu['cv_1'])
                inipopu.stock_2_mean = float(popu['stock_2_mean'])
                inipopu.cv_2 = float(popu['cv_2'])
                populist.append(inipopu)
            pgi.iniPopu = populist
            pgi.save()

        return Response(json.dumps({'status':1}), mimetype='application/json')

    #process Biological Parameters
    @expose('/step5/<string:pk>', methods = ['PUT'])
    @has_access
    def step5(self,pk):
        if request.method == 'PUT':
            pgi = ProcessGenInput.objects(id=pk).first()
            originlist = request.get_json()
            biolist = []

            for origin in originlist:
                bioparam = BioParameter()
                bioparam.age_1 = int(origin['age_1'])
                bioparam.weight_at_age_1 = float(origin['weight_at_age_1'])
                bioparam.fec_at_age_1 = float(origin['fec_at_age_1'])
                bioparam.weight_at_age_2 = float(origin['weight_at_age_2'])
                bioparam.fec_at_age_2 = float(origin['fec_at_age_2'])
                biolist.append(bioparam)

            pgi.bioParam = biolist
            pgi.save()
        return Response(json.dumps({'status':1}), mimetype='application/json')

    #process Natural Mortality
    @expose('/step6/<string:pk>', methods = ['PUT'])
    @has_access
    def step6(self,pk):
        if request.method == 'PUT':
            pgi = ProcessGenInput.objects(id=pk).first()
            inputparam = request.get_json()

            pgi.mortality_complexity = int(inputparam['mortality_complexity']);
            pgi.nm_m = inputparam['nm_m'];
            pgi.nm_cv_1 = float(inputparam['nm_cv_1']);
            pgi.nm_cv_2 = float(inputparam['nm_cv_2']);

            mortalitylist = inputparam['mortality']

            morlist = []

            for origin in mortalitylist:
                morParam = Mortality()
                morParam.age_1 = int(origin['age_1'])
                morParam.mean_1 = float(origin['mean_1'])
                morParam.cv_mean_1 = float(origin['cv_mean_1'])
                morParam.mean_2 = float(origin['mean_2'])
                morParam.cv_mean_2 = float(origin['cv_mean_2'])
                morlist.append(morParam)

            pgi.mortality = morlist
            pgi.save()

        return Response(json.dumps({'status':1}), mimetype='application/json')

    #process Recruitment
    @expose('/step7/<string:pk>', methods = ['PUT'])
    @has_access
    def step7(self,pk):
        if request.method == 'PUT':
            pgi = ProcessGenInput.objects(id=pk).first()
            inputparam = request.get_json()


            pgi.simple_spawning = float(inputparam['simple_spawning']);
            pgi.cvForRecu = inputparam['cvForRecu']
            pgi.stock1_amount = inputparam['stock1_amount']
            pgi.stock2_amount = inputparam['stock2_amount']
            pgi.recruitTypeStock1 = inputparam['recruitTypeStock1']
            pgi.fromHisStock1 = inputparam['fromHisStock1']

        #Management Options VII
            if pgi.louisiana != global_settings.louisiana:
                changes.add("louisiana")
            if pgi.mississippi != global_settings.mississippi:
                changes.add("mississippi")
            if pgi.alabama != global_settings.alabama:
                changes.add("alabama")
            if pgi.texas != global_settings.texas:
                changes.add("texas")
            if pgi.florida != global_settings.florida:
                changes.add("florida")

            pgi.historySt1 = inputparam['historySt1']
            pgi.hst1_mean = inputparam['hst1_mean']
            pgi.hst1_other = inputparam['hst1_other']
            pgi.hst1_cal = inputparam['hst1_cal']


            pgi.historySt1_early = inputparam['historySt1_early']
            pgi.hst1_mean_early = inputparam['hst1_mean_early']
            pgi.hst1_other_early = inputparam['hst1_other_early']
            pgi.hst1_cal_early = inputparam['hst1_cal_early']

            pgi.formulaStock1 = inputparam['formulaStock1']
            pgi.fromFmlStock1 = inputparam['fromFmlStock1']
            pgi.fml1MbhmSSB0 = inputparam['fml1MbhmSSB0']
            pgi.fml1MbhmR0 = inputparam['fml1MbhmR0']
            pgi.fml1MbhmSteep = inputparam['fml1MbhmSteep']
            pgi.fml1MbhmR0_early = inputparam['fml1MbhmR0_early']

            pgi.save()

        return Response(json.dumps({'status':1}), mimetype='application/json')

    #get Rhist from global GlobalSetting to calculate percentile in Recruitment
    @expose('/calc' , methods = ['POST'])
    @has_access
    def calc(self):
        if request.method == 'POST':
            global_settings = GlobalSettings.objects.first()
            data = request.get_json()
            percentile = float(data['percentile'])
            isEarly = data['early'];
            Rhist = []
            result = 0

            if isEarly == True:
                Rhist = global_settings.hst1_early
                result = np.percentile(Rhist, percentile)
            else:
                Rhist = global_settings.hst1
                result = np.percentile(Rhist, percentile)

            return Response(json.dumps({'result':result}), mimetype='application/json')






    #process Management 1
    @expose('/step8/<string:pk>', methods = ['PUT'])
    @has_access
    def step8(self,pk):
        if request.method == 'PUT':
            pgi = ProcessGenInput.objects(id=pk).first()
            inputparam = request.get_json()

            #pgi.bio_f_percent = float(inputparam['bio_f_percent'])/0.75;
            pgi.harvest_level = float(inputparam['harvest_level']);
            pgi.mg1_cv = inputparam['mg1_cv'];

            pgi.save()

        return Response(json.dumps({'status':1}), mimetype='application/json')

    #process Management 2
    @expose('/step9/<string:pk>', methods = ['PUT'])
    @has_access
    def step9(self,pk):
        if request.method == 'PUT':
            pgi = ProcessGenInput.objects(id=pk).first()
            inputparam = request.get_json()

            pgi.sec_commercial = inputparam['sec_commercial'];
            pgi.sec_recreational = inputparam['sec_recreational'];
            pgi.sec_headboat = inputparam['sec_headboat'];
            pgi.sec_charterboat = inputparam['sec_charterboat'];
            pgi.sec_hire = inputparam['sec_hire'];
            pgi.sec_private = inputparam['sec_private'];
            pgi.sec_pstar = inputparam['sec_pstar'];
            pgi.sec_act_com = inputparam['sec_act_com'];
            pgi.sec_act_pri = inputparam['sec_act_pri'];
            pgi.sec_act_hire = inputparam['sec_act_hire'];
            pgi.p_e = inputparam['p_e'];
            pgi.p_w = inputparam['p_w'];

            pgi.save()

        return Response(json.dumps({'status':1}), mimetype='application/json')

    #Management 7
    @expose('/stateQuotas/<string:pk>', methods = ['PUT'])
    @has_access
    def stateQuotas(self,pk):
        if request.method == 'PUT':
            pgi = ProcessGenInput.objects(id=pk).first()
            inputparam = request.get_json()

            pgi.louisiana = float(inputparam['louisiana']);
            pgi.mississippi = float(inputparam['mississippi']);
            pgi.alabama = float(inputparam['alabama']);
            pgi.texas = float(inputparam['texas']);
            pgi.florida = float(inputparam['florida']);
            pgi.save()

        return Response(json.dumps({'status':1}), mimetype='application/json')

    #process Management 3
    @expose('/step10/<string:pk>', methods = ['PUT'])
    @has_access
    def step10(self,pk):
        if request.method == 'PUT':
            pgi = ProcessGenInput.objects(id=pk).first()

            inputparam = request.get_json()

            pgi.mg3_commercial = inputparam['mg3_commercial'];
            pgi.mg3_recreational = inputparam['mg3_recreational'];
            pgi.mg3_forhire = inputparam['mg3_forhire'];
            pgi.mg3_private = inputparam['mg3_private'];

            pgi.est_fed_forhire = inputparam['est_fed_forhire']
            pgi.est_AL_private = inputparam['est_AL_private']
            pgi.est_FL_private = inputparam['est_FL_private']
            pgi.est_LA_private = inputparam['est_LA_private']
            pgi.est_MS_private = inputparam['est_MS_private']
            pgi.est_MS_forhire = inputparam['est_MS_forhire']
            pgi.est_TX_private = inputparam['est_TX_private']
            pgi.est_TX_forhire = inputparam['est_TX_forhire']

            pgi.save()

        return Response(json.dumps({'status':1}), mimetype='application/json')


    #process Management 4
    @expose('/step10_2/<string:pk>', methods = ['PUT'])
    @has_access
    def step10_2(self,pk):
        if request.method == 'PUT':
            pgi = ProcessGenInput.objects(id=pk).first()

            inputparam = request.get_json()

            pgi.mg3_rec_east_open = inputparam['rec_east_open'];
            pgi.mg3_rec_east_closed = inputparam['rec_east_closed'];
            pgi.mg3_rec_west_open = inputparam['rec_west_open'];
            pgi.mg3_rec_west_closed = inputparam['rec_west_closed'];
            pgi.mg3_comhard_east_open = inputparam['comhard_east_open'];
            pgi.com_stock1_closed = inputparam['com_stock1_closed'];
            pgi.mg3_comhard_west_open = inputparam['comhard_west_open'];
            pgi.com_stock2_closed = inputparam['com_stock2_closed'];
            pgi.mg3_comlong_east_open = inputparam['comlong_east_open'];
            pgi.mg3_comlong_west_open = inputparam['comlong_west_open'];

            pgi.save()

        return Response(json.dumps({'status':1}), mimetype='application/json')

    #process Management 5
    @expose('/step11/<string:pk>', methods = ['PUT'])
    @has_access
    def step11(self,pk):
        if request.method == 'PUT':
            pgi = ProcessGenInput.objects(id=pk).first()

            inputparam = request.get_json()

            pgi.base_fed_forhire = inputparam['base_fed_forhire'];
            pgi.base_AL_private = inputparam['base_AL_private'];
            pgi.base_FL_private = inputparam['base_FL_private'];
            pgi.base_LA_private = inputparam['base_LA_private'];
            pgi.base_MS_private = inputparam['base_MS_private'];
            pgi.base_MS_forhire = inputparam['base_MS_forhire'];
            pgi.base_TX_private = inputparam['base_TX_private'];
            pgi.base_TX_forhire = inputparam['base_TX_forhire'];
            pgi.est_fed_forhire = inputparam['est_fed_forhire'];
            pgi.est_AL_private = inputparam['est_AL_private'];
            pgi.est_FL_private = inputparam['est_FL_private'];
            pgi.est_LA_private = inputparam['est_LA_private'];
            pgi.est_MS_private = inputparam['est_MS_private'];
            pgi.est_MS_forhire = inputparam['est_MS_forhire'];
            pgi.est_TX_private = inputparam['est_TX_private'];
            pgi.est_TX_forhire = inputparam['est_TX_forhire'];
            pgi.season_fed_forhire = inputparam['season_fed_forhire'];
            pgi.season_private = inputparam['season_private'];
            pgi.fed_forhire_length = inputparam['fed_forhire_length'];
            pgi.AL_private_length = inputparam['al_private_length'];
            pgi.FL_private_length = inputparam['fl_private_length'];
            pgi.LA_private_length = inputparam['la_private_length'];
            pgi.MS_private_length = inputparam['ms_private_length'];
            pgi.MS_forhire_length = inputparam['ms_forhire_length'];
            pgi.TX_private_length = inputparam['tx_private_length'];
            pgi.TX_forhire_length = inputparam['tx_forhire_length'];

            pgi.save()

        return Response(json.dumps({'status':1}), mimetype='application/json')

    #step Management 6
    @expose('/step12/<string:pk>', methods=['PUT'])
    @has_access
    def step12(self,pk):
        if request.method == 'PUT':
            pgi = ProcessGenInput.objects(id=pk).first()
            inputparam = request.get_json()

            pgi.penalty_switch = inputparam['penalty_switch']
            pgi.carryover_switch = inputparam['carryover_switch']

            pgi.save()
        return Response(json.dumps({'status':1}), mimetype='application/json')

    @expose('/resetValues/<string:pk>', methods=['PUT'])
    @has_access
    def resetValues(self,pk):
        if request.method == 'PUT':
            pgi = ProcessGenInput.objects(id=pk).first()
            pgi.initDefaults()

            pgi.save()
        return Response(json.dumps({'status':1}), mimetype='application/json')


    ##############################################################################################
    # process step1 : rnd file upload, keep it for future use, implemented multiple files upload #
    ##############################################################################################
    @expose('/rndSeedFile/<string:pk>', methods = ['POST','DELETE'])
    @has_access
    def uploadRndSeedFile(self,pk):
        #app_stack = _app_ctx_stack or _request_ctx_stack
        #ctx = app_stack.top

        pgi = ProcessGenInput.objects(id=pk).first()
        pgi.update(changed_by=current_user.id,changed_on=datetime.datetime.now)

        if request.method == 'POST':
            files = request.files['file']

            if files:
                filename = secure_filename(files.filename)

                mime_type = files.content_type

                if not self.allowed_file(files.filename):
                    result = uploadfile(name=filename, type=mime_type, size=0, not_allowed_msg="File type not allowed")
                else:
                    onefile = mongoengine.fields.GridFSProxy()
                    onefile.put(files,content_type = mime_type,filename = files.filename)
                    pgi.rnd_seed_file.append(onefile)
                    #pgi.rnd_seed_file.replace(files,content_type = 'csv',filename = files.filename)
                    pgi.save()
                    #rnd = pgi.rnd_seed_file.read()
                    #print(pgi.rnd_seed_file.filename)
                    #print(pgi.rnd_seed_file.content_type)

        if request.method == 'DELETE':
            filename = request.get_json()['filename']
            for file in pgi.rnd_seed_file:
                if hasattr(file,'name'):
                    if filename==file.name:
                        file.delete()
                        pgi.rnd_seed_file.pop(file_index)
                        pgi.save()
                    #ProcessGenInput.objects(id=pk).update_one(pull__rnd_seed_file=file)

        return json.dumps({})

    #######################################################################################
    # keep it for future use, implemented multiple files upload                           #
    #######################################################################################
    @expose('/rndSeedFile/download/<pk>/<filename>')
    @has_access
    def download(self, pk, filename):
        item = ProcessGenInput.objects(id=pk).first()
        for file in item.rnd_seed_file:
            if(filename==file.name):
                response = make_response(file.read())
                response.headers["Content-Disposition"] = "attachment; filename={0}".format(filename)
                response.mimetype = 'text/csv'
                return response

    #######################################################################################
    # keep it for future use, implemented single file upload                              #
    #######################################################################################

    #process step3 : stock1 file upload
    @expose('/stock1file/<string:pk>', methods = ['POST','DELETE'])
    @has_access
    def uploadStock1File(self,pk):
        #app_stack = _app_ctx_stack or _request_ctx_stack
        #ctx = app_stack.top

        pgi = ProcessGenInput.objects(id=pk).first()
        pgi.update(changed_by=current_user.id,changed_on=datetime.datetime.now)

        if request.method == 'POST':
            files = request.files['file']

            if files:
                filename = secure_filename(files.filename)

                mime_type = files.content_type
                '''
                if not self.allowed_file(files.filename):
                    result = uploadfile(name=filename, type=mime_type, size=0, not_allowed_msg="File type not allowed")
                else:
                    pgi.stock1_filepath.replace(files,content_type = 'csv',filename = files.filename)
                    pgi.save()
                '''
                pgi.stock1_filepath.replace(files,content_type = mime_type,filename = files.filename)
                pgi.save()

        if request.method == 'DELETE':
            pgi.stock1_filepath.delete()

        return json.dumps({})

    #######################################################################################
    # keep it for future use, implemented single file upload                              #
    #######################################################################################

    @expose('/stock1file/download/<pk>')
    @has_access
    def downloadStock1File(self, pk):
        item = ProcessGenInput.objects(id=pk).first()
        file = item.stock1_filepath.read()
        response = make_response(file)
        response.headers["Content-Disposition"] = "attachment; filename={0}".format(item.stock1_filepath.filename)
        response.mimetype = item.stock1_filepath.content_type
        return response

    @expose('/getIniPopuTableData/<pk>')
    @has_access
    def getIniPopuTableData(self,pk):

        pgi = ProcessGenInput.objects(id=pk).first()
        if pgi.iniPopu != None and len(pgi.iniPopu)>0:
            return Response(pgi.to_json(), mimetype='application/json')

        else:
            global_settings = GlobalSettings.objects.first()

            pgi.iniPopu = global_settings.iniPopu

            pgi.save()

            return Response(pgi.to_json(), mimetype='application/json')

    @expose('/getBioParamTableData/<pk>')
    @has_access
    def getBioParamTableData(self,pk):

        pgi = ProcessGenInput.objects(id=pk).first()

        if pgi.bioParam != None and len(pgi.bioParam)>0:
            return Response(pgi.to_json(), mimetype='application/json')

        else:
            global_settings = GlobalSettings.objects.first()

            pgi.bioParam = global_settings.bioParam

            pgi.save()

            return Response(pgi.to_json(), mimetype='application/json')

    @expose('/getMortalityTableData/<pk>')
    @has_access
    def getMortalityTableData(self,pk):

        pgi = ProcessGenInput.objects(id=pk).first()

        if pgi.mortality != None and len(pgi.mortality)>0:
            return Response(pgi.to_json(), mimetype='application/json')

        else:
            global_settings = GlobalSettings.objects.first()

            pgi.mortality = global_settings.mortality

            pgi.save()

            return Response(pgi.to_json(), mimetype='application/json')

    @expose('/editTableData', methods = ['POST'])
    @has_access
    def editTableData(self):

        print(request.form["stock_1_mean"])

        return Response(json.dumps({'status':1}), mimetype='application/json')

    @expose('/getEchartData')
    @has_access
    def getEchartData(self):

        file_data = 'static/csv/F by Fleet.csv'

        df_E = pd.read_csv(os.path.join(os.path.dirname(__file__),file_data),usecols=['Yr','F_std','HL_E','HL_W'])

        return Response(df_E.to_json(orient='records'), mimetype='application/json')

    @expose('/getSsbAndFEchart')
    @has_access
    def getSsbAndFEchart(self):

        file_data = 'static/csv/ssbF.csv'

        df_E = pd.read_csv(os.path.join(os.path.dirname(__file__),file_data),usecols=['plot_years','plot_ssb','plot_F'])
        return Response(df_E.to_json(orient='records'), mimetype='application/json')

    @expose('/getMseInfo/<string:pid>')
    @has_access
    def getMseInfo(self,pid):

        pgi = ProcessGenInput.objects(process_id=pid).first()
        print(pgi)

        return Response(pgi.to_json(), mimetype='application/json')

    @expose('/propublic/<string:pk>', methods = ['PUT'])
    @has_access
    def propublic(self,pk):

        prs = Process.objects(id=pk).first()
        #if is registered user
        if request.form["public"]=='true'and current_user.roles[0].name == 'Registered User':
            #if user wants to make a 3rd process public
            if Process.objects(Q(created_by=current_user.id)&Q(process_public=True)).count() == 2:
                #check confirmation response from user before making public
                if request.form["confirm"] == 'true':
                    prs.process_public = True if request.form["public"]=='true' else False
                    prs.save()
                    return Response(json.dumps({'status': 1}), mimetype='application/json')
                else:
                    #ask user to confirm
                    return Response(json.dumps({'status': 2}), mimetype='application/json')
            #user already has 3 or more process public, notify user
            elif Process.objects(Q(created_by=current_user.id)&Q(process_public=True)).count() >= 3:
                return Response(json.dumps({'status': 3}), mimetype='application/json')

        #request from admin or attempt to make public false are saved with no problem
        if request.form["public"]:
            prs.process_public = True if request.form["public"]=='true' else False
        prs.save()
        return Response(json.dumps({'status':1}), mimetype='application/json')

    @expose('/prosimple/<string:pk>', methods = ['PUT'])
    @has_access
    def prosimple(self,pk):

        prs = Process.objects(id=pk).first()
        if request.form["simple"]:
            prs.process_simple = True if request.form["simple"]=='true' else False
        prs.save()
        return Response(json.dumps({'status':1}), mimetype='application/json')

    @expose('/setDefault/<string:pk>', methods = ['PUT'])
    @has_access
    def setDefault(self,pk):

        stockFile = StockFile.objects(id=pk).first()

        oldDefault = StockFile.objects(default_file=True).first()

        if oldDefault != None:
            oldDefault.default_file = False
            oldDefault.save()

        print(stockFile)

        stockFile.default_file = True
        stockFile.save()
        return Response(json.dumps({'status':1}), mimetype='application/json')


    @expose('/getVisitors')
    def getVisitors(self):

        login_count = User.objects.sum('login_count')

        registed_count = User.objects.count()

        mse_count = Process.objects.count()

        return Response(json.dumps({'login_count':login_count,'registed_count':registed_count,'mse_count':mse_count}), mimetype='application/json')

    @expose('/getMesResult/<pro_gen_id>')
    @has_access
    def getMesResult(self,pro_gen_id):

        print(pro_gen_id)

        mseresult = MseResultList.objects(process_gen_id=pro_gen_id).first()

        print(mseresult)

        if mseresult!=None and mseresult.resultlist != None and len(mseresult.resultlist)>0:
            return Response(mseresult.to_json(), mimetype='application/json')

        return Response(json.dumps({}), mimetype='application/json')

    @expose('/getMesInput/<pro_gen_id>')
    @has_access
    def getMesInput(self,pro_gen_id):

        print(pro_gen_id)

        mseInput = ProcessGenInput.objects(id=pro_gen_id).first()
        process = mseInput.process_id

        #check if user has run the model
        hasResult = False
        res = MseResultList.objects(process_gen_id=pro_gen_id).first()
        if res != None:
            hasResult = True

        info = {}
        if process.created_by != None:
            if process != None:
                info = {
                "scenario" : process.process_name,
                "description":process.process_description,
                "created_by":process.created_by.first_name + " " + process.created_by.last_name,
                "last_modified":mseInput.changed_on.strftime("%m/%d/%Y, %H:%M:%S"),
                "hasMseResult" : hasResult
                }
        else:
            info = {
                "scenario" : "Public Scenario",
                "description":"Standard Scenario",
                "created_by":"General Public",
                "last_modified":mseInput.changed_on.strftime("%m/%d/%Y, %H:%M:%S"),
                "hasMseResult" : hasResult
                }

        if mseInput!=None and process != None :
            mse_dict = json.loads(mseInput.to_json())
            return Response(json.dumps({'result':mse_dict,'info':info}),mimetype='application/json')

        return Response(json.dumps({}), mimetype='application/json')

    @expose('/trackChanges/<pk>')
    @has_access
    def trackChanges(self, pk):
        changes = set()
        global_settings = GlobalSettings.objects.first()
        pgi = ProcessGenInput.objects(id=pk).first()

        if pgi == None:
            return Response(json.dumps({}), mimetype='application/json')


        #store which variables have changed from global settings to highlight in pdf
        #General Input
        if int(pgi.short_term_mgt) != global_settings.short_term_mgt:
            changes.add("short_term_mgt")
        if int(pgi.long_term_mgt) != global_settings.long_term_mgt:
            changes.add("long_term_mgt")
        if int(pgi.observ_err_EW_stock) != global_settings.observ_err_EW_stock:
            changes.add("observ_err_EW_stock")
        if int(pgi.no_of_interations) != global_settings.no_of_interations:
            changes.add("no_of_interations")
        if int(pgi.sample_size) != global_settings.sample_size:
            changes.add("sample_size")
        if pgi.rnd_seed_setting != global_settings.rnd_seed_setting:
            changes.add("rnd_seed_setting")

        #Initial Population
        if pgi.ip_cv_1 != global_settings.ip_cv_1:
            changes.add("ip_cv_1")
        if pgi.ip_cv_2 != global_settings.ip_cv_2:
            changes.add("ip_cv_2")

        #Natural Mortality
        if pgi.nm_m != global_settings.nm_m:
            changes.add("nm_m")
        if pgi.nm_cv_1 != global_settings.nm_cv_1:
            changes.add("nm_cv_1")
        if pgi.nm_cv_2 != global_settings.nm_cv_2:
            changes.add("nm_cv_2")

        #Recruitment
        if pgi.simple_spawning != global_settings.simple_spawning:
            changes.add("simple_spawning")
        if Decimal(pgi.cvForRecu) != global_settings.cvForRecu:
            changes.add("cvForRecu")
        if Decimal(pgi.stock1_amount) != global_settings.stock1_amount:
            changes.add("stock1_amount")
        if pgi.recruitTypeStock1 != global_settings.recruitTypeStock1:
            changes.add("recruitTypeStock1")
        if Decimal(pgi.fml1MbhmSSB0) != global_settings.fml1MbhmSSB0:
            changes.add("fml1MbhmSSB0")
        if Decimal(pgi.fml1MbhmR0) != global_settings.fml1MbhmR0:
            changes.add("fml1MbhmR0")
        if Decimal(pgi.fml1MbhmSteep) != global_settings.fml1MbhmSteep:
            changes.add("fml1MbhmSteep")
        if Decimal(pgi.fml1MbhmR0_early) != global_settings.fml1MbhmR0_early:
            changes.add("fml1MbhmR0_early")

        #Management Options I
        if pgi.harvest_level != global_settings.harvest_level:
            changes.add("harvest_level")
        if Decimal(pgi.mg1_cv) != global_settings.mg1_cv:
            changes.add("mg1_cv")

        #Management Options II
        if Decimal(pgi.sec_recreational) != global_settings.sec_recreational:
            changes.add("sec_recreational")
        if Decimal(pgi.sec_headboat) != global_settings.sec_headboat:
            changes.add("sec_headboat")
        if Decimal(pgi.sec_hire) != global_settings.sec_hire:
            changes.add("sec_hire")
        if Decimal(pgi.sec_pstar) != global_settings.sec_pstar:
            changes.add("sec_pstar")
        if Decimal(pgi.sec_act_com) != global_settings.sec_act_com:
            changes.add("sec_act_com")
        if Decimal(pgi.sec_act_pri) != global_settings.sec_act_pri:
            changes.add("sec_act_pri")
        if Decimal(pgi.sec_act_hire) != global_settings.sec_act_hire:
            changes.add("sec_act_hire")

        #Management Options III
        if Decimal(pgi.mg3_commercial) != global_settings.mg3_commercial:
            changes.add("mg3_commercial")
        if Decimal(pgi.mg3_recreational) != global_settings.mg3_recreational:
            changes.add("mg3_recreational")
        if int(pgi.mg3_forhire) != global_settings.mg3_forhire:
            changes.add("mg3_forhire")
        if int(pgi.mg3_private) != global_settings.mg3_private:
            changes.add("mg3_private")

        #Management Options IV
        if Decimal(pgi.mg3_rec_east_open) != global_settings.mg3_rec_east_open:
            changes.add("mg3_rec_east_open")
        if Decimal(pgi.mg3_rec_east_closed) != global_settings.mg3_rec_east_closed:
            changes.add("mg3_rec_east_closed")
        if Decimal(pgi.mg3_rec_west_open) != global_settings.mg3_rec_west_open:
            changes.add("mg3_rec_west_open")
        if Decimal(pgi.mg3_rec_west_closed) != global_settings.mg3_rec_west_closed:
            changes.add("mg3_rec_west_closed")
        if Decimal(pgi.mg3_comhard_east_open) != global_settings.mg3_comhard_east_open:
            changes.add("mg3_comhard_east_open")
        if Decimal(pgi.mg3_comhard_west_open) != global_settings.mg3_comhard_west_open:
            changes.add("mg3_comhard_west_open")
        if Decimal(pgi.mg3_comlong_east_open) != global_settings.mg3_comlong_east_open:
            changes.add("mg3_comlong_east_open")
        if Decimal(pgi.mg3_comlong_west_open) != global_settings.mg3_comlong_west_open:
            changes.add("mg3_comlong_west_open")
        if Decimal(pgi.com_stock1_closed) != global_settings.com_stock1_closed:
            changes.add("com_stock1_closed")
        if Decimal(pgi.com_stock2_closed) != global_settings.com_stock2_closed:
            changes.add("com_stock2_closed")

        #Management Options V
        if Decimal(pgi.base_fed_forhire) != global_settings.base_fed_forhire:
            changes.add("base_fed_forhire")
        if Decimal(pgi.est_fed_forhire) != global_settings.base_fed_forhire:
            changes.add("est_fed_forhire")
        if Decimal(pgi.base_AL_private) != global_settings.base_AL_private:
            changes.add("base_AL_private")
        if Decimal(pgi.est_AL_private) != global_settings.base_AL_private:
            changes.add("est_AL_private")
        if Decimal(pgi.base_FL_private) != global_settings.base_FL_private:
            changes.add("base_FL_private")
        if Decimal(pgi.est_FL_private) != global_settings.base_FL_private:
            changes.add("est_FL_private")
        if Decimal(pgi.base_LA_private) != global_settings.base_LA_private:
            changes.add("base_LA_private")
        if Decimal(pgi.est_LA_private) != global_settings.base_LA_private:
            changes.add("est_LA_private")
        if Decimal(pgi.base_MS_private) != global_settings.base_MS_private:
            changes.add("base_MS_private")
        if Decimal(pgi.est_MS_private) != global_settings.base_MS_private:
            changes.add("est_MS_private")
        if Decimal(pgi.base_MS_forhire) != global_settings.base_MS_forhire:
            changes.add("base_MS_forhire")
        if Decimal(pgi.est_MS_forhire) != global_settings.base_MS_forhire:
            changes.add("est_MS_forhire")
        if Decimal(pgi.base_TX_private) != global_settings.base_TX_private:
            changes.add("base_TX_private")
        if Decimal(pgi.est_TX_private) != global_settings.base_TX_private:
            changes.add("est_TX_private")
        if Decimal(pgi.base_TX_forhire) != global_settings.base_TX_forhire:
            changes.add("base_TX_forhire")
        if Decimal(pgi.est_TX_forhire) != global_settings.base_TX_forhire:
            changes.add("est_TX_forhire")
        if pgi.season_fed_forhire != global_settings.season_fed_forhire:
            changes.add("season_fed_forhire")
        if pgi.season_private != global_settings.season_private:
            changes.add("season_private")
        if int(pgi.fed_forhire_length) != global_settings.fed_forhire_length:
            changes.add("fed_forhire_length")
        if int(pgi.AL_private_length) != global_settings.AL_private_length:
            changes.add("AL_private_length")
        if int(pgi.FL_private_length) != global_settings.FL_private_length:
            changes.add("FL_private_length")
        if int(pgi.LA_private_length) != global_settings.LA_private_length:
            changes.add("LA_private_length")
        if int(pgi.MS_private_length) != global_settings.MS_private_length:
            changes.add("MS_private_length")
        if int(pgi.MS_forhire_length) != global_settings.MS_forhire_length:
            changes.add("MS_forhire_length")
        if int(pgi.TX_private_length) != global_settings.TX_private_length:
            changes.add("TX_private_length")
        if int(pgi.TX_forhire_length) != global_settings.TX_forhire_length:
            changes.add("TX_forhire_length")

        #Management Options VI
        if pgi.penalty_switch != global_settings.penalty_switch:
            changes.add("penalty_switch")
        if pgi.carryover_switch != global_settings.carryover_switch:
            changes.add("carryover_switch")

        #Management Options VII

        if pgi.louisiana != global_settings.louisiana:
            changes.add("louisiana")
        if pgi.mississippi != global_settings.mississippi:
            changes.add("mississippi")
        if pgi.alabama != global_settings.alabama:
            changes.add("alabama")
        if pgi.texas != global_settings.texas:
            changes.add("texas")
        if pgi.florida != global_settings.florida:
            changes.add("florida")

        print(changes)
        print("finised")

        return Response(json.dumps({'changes': list(changes)}), mimetype='application/json')

class StockFileView(ModelView):

    datamodel = MongoEngineInterface(StockFile)

    list_template = 'stock_file.html'

    label_columns = {'file_name': 'File Name','ssb_msy':'SSB(msy)','f_msy':'F(msy)','description':'Description','download': 'Download', 'spr_ratio': 'SPR Ratio'}
    add_columns =  ['file','ssb_msy','f_msy', 'description', 'spr_ratio']
    edit_columns = ['file', 'description','f_msy', 'description', 'spr_ratio']
    list_columns = ['file_name', 'description','ssb_msy','f_msy','spr_ratio', 'created_by', 'created_on', 'changed_by', 'changed_on','is_default','download']
    show_fieldsets = [
        ('Info', {'fields': ['file_name','ssb_msy','f_msy', 'spr_ratio','description', 'default_file', 'download']}),
        ('Audit', {'fields': ['created_by', 'created_on', 'changed_by', 'changed_on'], 'expanded': False})
    ]
    formatters_columns = {'created_on': lambda x: x.strftime("%Y-%m-%d %H:%M:%S"),'changed_on': lambda x: x.strftime("%Y-%m-%d %H:%M:%S") }
    base_permissions = ['can_list','can_add','can_delete','can_show','can_download']

    def pre_add(self, item):
        item.created_by = current_user.id

    def pre_update(self, item):
        item.changed_by = current_user.id

    def pre_delete(self,item):
        if item.default_file is True:
            settings = GlobalSettings.objects.first()
            if settings != None:
                settings.delete()

    @expose('/download/<pk>')
    @has_access
    def download(self, pk):
        item = self.datamodel.get(pk)
        file = item.file.read()
        response = make_response(file)
        response.headers["Content-Disposition"] = "attachment; filename={0}".format(item.file.name)
        return response

class MultipleScenarioView(MultipleView):
    views = [ProcessView, ProcessViewOther]
    list_template = "mse_management.html"

    @expose('/list/')
    @has_access
    def list(self):
        pages = get_page_args()
        page_sizes = get_page_size_args()
        orders = get_order_args()
        views_widgets = list()
        search_widgets = list()
        tags = list()
        index = 0
        for view in self._views:
            if orders.get(view.__class__.__name__):
                order_column, order_direction = orders.get(view.__class__.__name__)
            else:
                order_column, order_direction = '', ''
            page = pages.get(view.__class__.__name__)
            page_size = page_sizes.get(view.__class__.__name__)
            widget = view._get_view_widget(filters=view._base_filters,
                                                       order_column=order_column,
                                                       order_direction=order_direction,
                                                       page=page, page_size=page_size)
            views_widgets.append(widget.get('list'))
            search_widgets.append(widget.get('search'))
            tags.append(index)
            print(tags)
            index = index + 1
        self.update_redirect()
        return self.render_template(self.list_template,
                                    views=self._views,
                                    views_widgets=views_widgets, search_widgets=search_widgets, tags=tags)




class DemoView(BaseView):
    route_base="/demo"

    @expose("/basicRun/")
    @has_access
    def basicRun(self):
        processes = Process.objects(process_name="Basic Run")
        mseresult = None
        for process in processes:
            # print(process.created_by.roles[0])
            # if process.created_by.roles[0].name == 'Admin':
            pgi = ProcessGenInput.objects(process_id=process.id).first()
            mseresult = MseResultList.objects(process_gen_id=str(pgi.id)).first()

            if mseresult!=None and mseresult.resultlist != None and len(mseresult.resultlist)>0:
                return self.render_template('basicRun.html',scenario=mseresult.to_json())

        if mseresult != None:
            return self.render_template('basicRun.html',scenario=mseresult.to_json())

        return self.render_template('basicRun.html')

    @expose("/legalSize/")
    @has_access
    def legalSize(self):

        processes = Process.objects(Q(process_name="comm 13in")|Q(process_name="comm 13.5in")|Q(process_name="comm 14in")|Q(process_name="comm 14.5in")|Q(process_name="comm 15in"))
        
        mseNames = []
        mseComp = []
        mseSingleLists = []
        scenarios = []

        if processes is None or len(processes) < 5:
            return self.render_template('legalSize.html')

        #processes.sort(key=lambda x: x.process_name.split('comm ')[1].split('in')[0], reverse=False)
        i = 0
        for process in processes:
            i = i + 1
            if i<6 :
                # if process.created_by.roles[0].name == 'Admin' :
                pgi = ProcessGenInput.objects(process_id=process.id).first()
                result = MseResultList.objects(process_gen_id=str(pgi.id)).first()
                if result is None:
                    return self.render_template('legalSize.html')

                #get names
                mseNames.append(process.process_name)
                mse_dict = json.loads(result.to_json())

                #get single list
                mseSingleLists.append(mse_dict['resultlist'])

                #get list of fields that are used for graphs in mse comparison page
                mseComp.append(mse_dict['mseCompFields'])
                scenarios.append(json.loads(pgi.to_json()))
        else:
                pass
        if len(scenarios) != 5:
            return self.render_template('legalSize.html')

        return self.render_template('legalSize.html',mseNames=json.dumps(mseNames),mseComp=json.dumps(mseComp),mseSingleLists=json.dumps(mseSingleLists),scenarios=json.dumps(scenarios))

    @expose("/allocation/")
    @has_access
    def allocation(self):

        processes = Process.objects(Q(process_name="49:51")|Q(process_name="50:50")|Q(process_name="51:49")|Q(process_name="52:48")|Q(process_name="53:47"))
        mseNames = []
        mseComp = []
        mseSingleLists = []
        scenarios = []

        if processes is None or len(processes) < 5:
            return self.render_template('allocation.html')

        for process in processes:
            # if process.created_by.roles[0].name == 'Admin':
            pgi = ProcessGenInput.objects(process_id=process.id).first()
            result = MseResultList.objects(process_gen_id=str(pgi.id)).first()

            if result is None:
                return self.render_template('allocation.html')

            #get names
            mseNames.append(process.process_name)
            mse_dict = json.loads(result.to_json())

            #get single list
            mseSingleLists.append(mse_dict['resultlist'])

            #get list of fields that are used for graphs in mse comparison page
            mseComp.append(mse_dict['mseCompFields'])
            scenarios.append(json.loads(pgi.to_json()))

        if len(scenarios) != 5:
            return self.render_template('allocation.html')

        return self.render_template('allocation.html',mseNames=json.dumps(mseNames),mseComp=json.dumps(mseComp),mseSingleLists=json.dumps(mseSingleLists),scenarios=json.dumps(scenarios))


class IntroView(BaseView):
    route_base="/intro"

    @expose("/detailedBackground/")
    #@has_access
    def basicDetailedBack(self):

        return self.render_template('detailedBackground.html')

    @expose("/glossary/")
    #@has_access
    def basicGlossary(self):

        return self.render_template('glossary.html')


class PublicMSE(BaseView):
    route_base="/public"
    datamodel = MongoEngineInterface(Process) 

    @expose("/scenario/")
    @has_access
    def add_public_scenario(self):
        #if current_user.roles[0].name != 'Public':
            #raise Exception('Unable to add scenario, you are a registered user. Please login')
            #flash('Unable to add scenario, you are a registered user. Please login', "danger")
            #return redirect(request.url)
        processes = Process.objects(Q(process_name="Basic Run"))
        print('Found the Basic Run with ID')
        pk = processes[0].id
        print(pk)
        item = self.datamodel.get(pk)
        pk = self.datamodel.get_pk_value(item)
        print('No idea')
        print(pk)
        new_item = self.datamodel.obj()
        new_item.process_public = True
        new_item.simple_scenario = True
        #new_item.created_by = current_user.id
        #new_item.changed_by = current_user.id
        new_name = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        new_item.process_name = new_name

        self.datamodel.add(new_item)

        processes = Process.objects(Q(process_name=new_name))
        pkd = processes[0].id
        print('new item id')
        print(pkd)
                    #set up pgi copy
        pgi = ProcessGenInput.objects(process_id=pk).first()
        new_pgi = deepcopy(pgi)
        new_pgi.id = None
        new_pgi.process_id = pkd

        new_pgi.save()
        new_pgi = ProcessGenInput.objects(process_id=pkd).first()
        print('Package created with id')
        print(new_pgi.id)

                    #set up mse result copy, if there exists one for the given pgi
        mseResult = MseResultList.objects(process_gen_id=str(pgi.id)).first()
        if mseResult != None:
            print('Mse result found')
            print(mseResult)
            new_mseResult = deepcopy(mseResult)
            new_mseResult.id = None
            new_mseResult.process_gen_id = str(new_pgi.id)
            new_mseResult.save()

        flash(*self.datamodel.message)

        

        return self.render_template('empty_temp.html', id = str(pkd))

    def initializePGI(self,item):
        step1 = ProcessGenInput.objects(process_id=item.id).first()
        return step1

    @expose('/<pk>')
    @has_access
    def show_public_scenario(self,pk):
        #item = ProcessGenInput.objects(process_id=pk).first()
        #ProcessGenInput.objects(process_id=pk).first()

        item = self.datamodel.get(pk)
        global_settings = GlobalSettings.objects.first()

        step1 = self.initializePGI(item)

        rndfilenames = []
        stock1_filename = None
        if step1.stock1_filepath :
            stock1_filename = step1.stock1_filepath.name
        print("===================")
        print(stock1_filename)
        print("===================")
        rndfiles = step1.rnd_seed_file
        for file in rndfiles:
            if hasattr(file,'name'):
                rndfilenames.append(file.name)

        current_F_ratio = global_settings.extraParam.Current_F_ratio[0]
        current_SSB_ratio = global_settings.extraParam.Current_SSB_ratio[0]

        #fix mean, SSB0, R0, and, steepness
        step1.hst1_mean = global_settings.hst1_mean
        step1.hst1_mean_early = global_settings.hst1_mean_early
        step1.fml1MbhmSSB0 = global_settings.fml1MbhmSSB0
        step1.fml1MbhmR0 = global_settings.fml1MbhmR0
        step1.fml1MbhmR0_early = global_settings.fml1MbhmR0_early
        step1.fml1MbhmSteep = global_settings.fml1MbhmSteep
        step1.save()

        #determine if user can edit the inputs in step view
        #notEditable = True
        #if current_user.id == item.created_by.id or current_user.roles[0].name == "Admin":
        notEditable = False

        #return appropriate template
        return self.render_template('/public_scenario.html', process_step1=step1,process_rndfilenames=json.dumps(rndfilenames),process_stock1filename=json.dumps(stock1_filename),process_name=item.process_name, process_description=item.process_description,process_current_F_ratio=current_F_ratio,process_current_SSB_ratio=current_SSB_ratio,notEditable=notEditable,isSimple=item.simple_scenario)



#Application wide 404 error handler
appbuilder.add_view_no_menu(IntroView())
appbuilder.add_link("Home", href="/", category="Introduction")
appbuilder.add_link("Detailed Background", href="/intro/detailedBackground", category="Introduction")
appbuilder.add_link("Glossary", href="/intro/glossary", category="Introduction")
appbuilder.add_view_no_menu(ResetRequestView())
appbuilder.add_view_no_menu(ResetPasswordFromRequestView())


appbuilder.add_view(StockFileView,"Stock File", icon='fa-folder-open-o', category='Input SA',category_icon="fa-envelope")
appbuilder.add_view(MultipleScenarioView,"MSE Scenarios", icon='fa-folder-open-o', category='MSE',category_icon="fa-envelope")
# appbuilder.add_view(ProcessView,"MSE Management", icon='fa-folder-open-o', category='MSE',category_icon="fa-envelope")
appbuilder.add_view(ProcessCmpView,"MSE Comparison", icon='fa-folder-open-o', category='MSE',category_icon="fa-envelope")
appbuilder.add_view(AdvancedMseView,"Advanced MSE", category='MSE', icon='fa-folder-open-o')
appbuilder.add_link("MSE Hindcasts", href="#", category="MSE", icon='fa-folder-open-o')
appbuilder.add_view_no_menu(ProStepView())

appbuilder.add_view(GuestProcessView,"Guest MSE Scenarios", icon='fa-folder-open-o', category='Guest MSE',category_icon="fa-envelope")
appbuilder.add_view(GuestProcessCmpView,"Guest MSE Comparison", icon='fa-folder-open-o', category='Guest MSE',category_icon="fa-envelope")
appbuilder.add_view_no_menu(ProcessView())
appbuilder.add_view_no_menu(ProcessViewOther())
appbuilder.add_view_no_menu(PublicMSE())

appbuilder.add_view_no_menu(DemoView())
appbuilder.add_link("Basic Run", href="/demo/basicRun", category="Demo")
appbuilder.add_link("Legal Size", href="/demo/legalSize", category="Demo")
appbuilder.add_link("Allocation", href="/demo/allocation", category="Demo")



appbuilder.security_cleanup()

@appbuilder.app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html', title="Page not found",base_template=appbuilder.base_template, appbuilder=appbuilder), 404
