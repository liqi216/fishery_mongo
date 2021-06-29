from mongoengine import connect
from mongoengine import Document, EmbeddedDocument, signals
from flask_appbuilder.security.mongoengine.models import RegisterUser, Role, get_user_id
from mongoengine import BooleanField,DateTimeField,FloatField,StringField, ReferenceField, ListField, FileField, IntField, SequenceField,DecimalField,EmbeddedDocumentListField,EmbeddedDocumentField
from flask import Markup, url_for
import datetime
from copy import deepcopy
from apscheduler.schedulers.background import BackgroundScheduler



class Process(Document):

    PROPRIVACY = (('PV', 'private'),
        ('PB', 'public'))
    PROVERSION = (('SP', 'simple'),
        ('PF', 'profession'))

    process_name = StringField(max_length=50, required=True)
    process_description = StringField(max_length=1000)
    process_public = BooleanField(default=False)
    simple_scenario = BooleanField(default=False)
    created_by = ReferenceField("User",reqired=True)
    created_on = DateTimeField(default=datetime.datetime.now, nullable=False)
    changed_by = ReferenceField("User",reqired=True)
    changed_on = DateTimeField(default=datetime.datetime.now,nullable=False)

class GIIniPopulation(EmbeddedDocument):

    age_1 = IntField()
    stock_1_mean = FloatField()
    cv_1 = DecimalField()
    stock_2_mean = FloatField()
    cv_2 = DecimalField()

class BioParameter(EmbeddedDocument):

    age_1 = IntField()
    weight_at_age_1 = FloatField()
    fec_at_age_1 = FloatField()
    weight_at_age_2 = FloatField()
    fec_at_age_2 = FloatField()

class Mortality(EmbeddedDocument):

    age_1 = IntField()
    mean_1 = FloatField()
    cv_mean_1 = DecimalField()
    mean_2 = FloatField()
    cv_mean_2 = DecimalField()

class Allocation(EmbeddedDocument):

    stock = StringField(max_length=50)
    fleet = StringField(max_length=50)
    allocation = DecimalField()

class extraF(EmbeddedDocument):

    hl_e_pred_F = FloatField()
    hl_w_pred_F = FloatField()
    ll_e_pred_F = FloatField()
    ll_w_pred_F = FloatField()
    mrip_e_pred_F = FloatField()
    mrip_w_pred_F = FloatField()
    hbt_e_pred_F  = FloatField()
    hbt_w_pred_F  = FloatField()
    comm_closed_e_pred_F = FloatField()
    comm_closed_w_pred_F = FloatField()
    rec_closed_e_pred_F = FloatField()
    rec_closed_w_pred_F = FloatField()
    shrimp_e_pred_F = FloatField()
    shrimp_w_pred_F = FloatField()
    
class ProcessGenInput(Document):

    TIMESTEP = (('M', '1 month'),
            ('HY', 'half year'),
            ('S', '1 season'),
            ('Y', '1 year'))

    process_id = ReferenceField("Process",reqired=True)
    #step1
    stock1_model_type = StringField(max_length=2)
    stock1_input_file_type = StringField(max_length=2)
    stock1_filepath = FileField()
    #step2
    time_step = StringField(max_length=2,choices=TIMESTEP)
    start_projection = DateTimeField(default=datetime.datetime.now)
    short_term_mgt = IntField()
    short_term_unit = StringField(max_length=2)
    long_term_mgt = IntField()
    long_term_unit = StringField(max_length=2)
    stock_per_mgt_unit = IntField()
    mixing_pattern = StringField(max_length=2)
    last_age = IntField()
    no_of_interations = IntField()
    sample_size = IntField()
    observ_err_EW_stock = IntField()
    rnd_seed_setting = StringField(max_length=2)
    rnd_seed_file = ListField(FileField())
    #step3
    unit1to1 = DecimalField()
    unit1to2 = DecimalField()
    unit2to1 = DecimalField()
    unit2to2 = DecimalField()
    #step4
    ip_cv_1 = DecimalField()
    ip_cv_2 = DecimalField()
    iniPopu = EmbeddedDocumentListField(GIIniPopulation)
    #step5
    bioParam = EmbeddedDocumentListField(BioParameter)
    #step6
    mortality_complexity = IntField()

    simple_spawning = DecimalField()
    nm_cv_1 = DecimalField()
    nm_cv_2 = DecimalField()
    nm_m = StringField(max_length=2)

    mortality = EmbeddedDocumentListField(Mortality)
    #step7
    cvForRecu = DecimalField()
    stock1_amount = DecimalField()
    stock2_amount = DecimalField()
    recruitTypeStock1 = StringField(max_length=2)
    fromHisStock1 = StringField(max_length=2)

    historySt1 = StringField(max_length=2)
    hst1_mean = DecimalField()
    hst1_other = DecimalField()
    hst1_cal = DecimalField()

    historySt1_early = StringField(max_length=2)
    hst1_mean_early = DecimalField()
    hst1_other_early = DecimalField()
    hst1_cal_early = DecimalField()

    formulaStock1 = StringField(max_length=2)
    fromFmlStock1 = StringField(max_length=2)
    fml1MbhmSSB0 = DecimalField()
    fml1MbhmR0 = DecimalField()
    fml1MbhmR0_early = DecimalField()
    fml1MbhmSteep = DecimalField()

    #step8
    bio_catch_mt = DecimalField()
    bio_f_percent = FloatField()
    hrt_harvest_rule = StringField(max_length=2)
    harvest_level = FloatField()
    mg1_cv = DecimalField()

    #step9
    sec_recreational = DecimalField()
    sec_commercial = DecimalField()
    sec_hire = DecimalField()
    sec_private = DecimalField()
    sec_headboat = DecimalField()
    sec_charterboat = DecimalField()
    sec_pstar = DecimalField()
    sec_act_com = DecimalField()
    sec_act_pri = DecimalField()
    sec_act_hire = DecimalField()
    p_e = DecimalField()
    p_w = DecimalField()

    #step10
    mg3_commercial = DecimalField()
    mg3_recreational = DecimalField()
    mg3_forhire = IntField()
    mg3_private = IntField()

    #step11
    mg3_rec_east_open = DecimalField()
    mg3_rec_east_closed = DecimalField()
    mg3_rec_west_open = DecimalField()
    mg3_rec_west_closed = DecimalField()
    mg3_comhard_east_open = DecimalField()
    mg3_comhard_west_open = DecimalField()
    mg3_comlong_east_open = DecimalField()
    mg3_comlong_west_open = DecimalField()
    com_stock1_closed = DecimalField()
    com_stock2_closed = DecimalField()
        
    #step12
    base_fed_forhire = DecimalField()
    base_AL_private = DecimalField()
    base_FL_private = DecimalField()
    base_LA_private = DecimalField()
    base_MS_private = DecimalField()
    base_MS_forhire = DecimalField()
    base_TX_private = DecimalField()
    base_TX_forhire = DecimalField()
    est_fed_forhire = DecimalField()
    est_AL_private = DecimalField()
    est_FL_private = DecimalField()
    est_LA_private = DecimalField()
    est_MS_private = DecimalField()
    est_MS_forhire = DecimalField()
    est_TX_private = DecimalField()
    est_TX_forhire = DecimalField()
    season_fed_forhire = StringField(max_length=2)
    season_private = StringField(max_length=2)
    fed_forhire_length = IntField()
    AL_private_length = IntField()
    FL_private_length = IntField()
    LA_private_length = IntField()
    MS_private_length = IntField()
    MS_forhire_length = IntField()
    TX_private_length = IntField()
    TX_forhire_length = IntField()

    #step13
    penalty_switch = StringField(max_length=2)
    carryover_switch = StringField(max_length=2)

    #step14
    alabama = FloatField(max_digits=8, decimal_places=5)
    louisiana = FloatField(max_digits=8, decimal_places=5)
    florida = FloatField(max_digits=8, decimal_places=5)
    mississippi = FloatField(max_digits=8, decimal_places=5)
    texas = FloatField(max_digits=8, decimal_places=5)

    #extral
    extra_F = EmbeddedDocumentListField(extraF)


    created_by = ReferenceField("User",reqired=True)
    created_on = DateTimeField(default=datetime.datetime.now, nullable=False)
    changed_by = ReferenceField("User",reqired=True)
    changed_on = DateTimeField(default=datetime.datetime.now,
                        onupdate=datetime.datetime.now, nullable=False)

class User(Document):
    meta = {
        "allow_inheritance": True
    }  # Added for user extension via Mongoengine Document inheritance

    first_name = StringField(max_length=64, required=True)
    last_name = StringField(max_length=64, required=True)
    username = StringField(max_length=64, required=True, unique=True)
    password = StringField(max_length=256)
    active = BooleanField()
    email = StringField(max_length=64, required=True, unique=True)
    last_login = DateTimeField()
    login_count = IntField()
    fail_login_count = IntField()
    roles = ListField(ReferenceField(Role))
    created_on = DateTimeField(default=datetime.datetime.now)
    changed_on = DateTimeField(default=datetime.datetime.now)

    created_by = ReferenceField("self", default=get_user_id())
    changed_by = ReferenceField("self", default=get_user_id())

    affiliation = StringField(max_length = 64)


def sensor():
    c = connect(
    db='fishery',
    username='fishery',
    password='fishery123',
    port=27017,
    host='localhost')
    processes = Process.objects.filter(created_by=None)
    now_time = datetime.datetime.now()
    for process in processes:
        print(process.id)
        #date_time_changed = datetime.datetime.strptime(process.changed_on, "%Y-%m-%d %H:%M:%S")
        diff = now_time - process.changed_on
        print(diff)
        if diff.days >= 1:
            step1 = ProcessGenInput.objects(process_id=process.id).first()
            step1.delete()
            process.delete()
    return


sensor()
#from flask import _app_ctx_stack
#from flask.globals import _request_ctx_stack
