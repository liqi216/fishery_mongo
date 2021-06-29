from mongoengine import Document, EmbeddedDocument, signals
from mongoengine import BooleanField,DateTimeField,FloatField,StringField, ReferenceField, ListField, FileField, IntField, SequenceField,DecimalField,EmbeddedDocumentListField,EmbeddedDocumentField
from flask import Markup, url_for
from flask_appbuilder.models.decorators import renders
#from flask_appbuilder.security.mongoengine.models import *
from flask_login import current_user
import datetime
import json
import logging
from app.jsonUtils import mongo_to_dict
from decimal import *
"""

Define you MongoEngine Models here

"""

class StockFile(Document):


	file = FileField(required=True)
	description = StringField(required=True,max_length=500)
	default_file = BooleanField(default=False)
	ssb_msy = FloatField(required=True)
	f_msy = FloatField(required=True)
	spr_ratio = FloatField()
	created_by = ReferenceField("User",reqired=True)
	created_on = DateTimeField(default=datetime.datetime.now, nullable=False)
	changed_by = ReferenceField("User",reqired=True)
	changed_on = DateTimeField(default=datetime.datetime.now,
                        onupdate=datetime.datetime.now, nullable=False)

	def is_default(self):
		if self.default_file is True:
			return Markup('<input type="radio" name="defaultfile" data-sfid="'+str(self.id)+'" data-fileid="'+str(self.file._id)+'" data-ssbmsy="'+str(self.ssb_msy)+'" data-fmsy="'+str(self.f_msy)+'" checked>')
		else:
			return Markup('<input type="radio" name="defaultfile" data-sfid="'+str(self.id)+'" data-fileid="'+str(self.file._id)+'" data-ssbmsy="'+str(self.ssb_msy)+'" data-fmsy="'+str(self.f_msy)+'" >')

	def download(self):
		if self.file:
			return Markup('<a href="' + url_for('StockFileView.download',pk=str(self.id))+'">Download')

		else:
			return Markup('')

	def file_name(self):
		return self.file.name


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

class extraParam(EmbeddedDocument):

	spawning_output_1 = ListField(FloatField())
	spawning_output_2 = ListField(FloatField())

	length_age_key = ListField(DecimalField()) # matrix
	length_age_key_row_name = ListField(StringField(max_length=5))
	length_age_key_stock1 = ListField(DecimalField())# matrix
	length_age_key_stock2 = ListField(DecimalField())# matrix

	hl_e_pred_F_ave = DecimalField()
	hl_w_pred_F_ave = DecimalField()
	ll_e_pred_F_ave = DecimalField()
	ll_w_pred_F_ave = DecimalField()
	mrip_e_pred_F_ave = DecimalField()
	mrip_w_pred_F_ave = DecimalField()
	hbt_e_pred_F_ave = DecimalField()
	hbt_w_pred_F_ave = DecimalField()
	comm_closed_e_pred_F_ave = DecimalField()
	comm_closed_w_pred_F_ave = DecimalField()
	rec_closed_e_pred_F_ave = DecimalField()
	rec_closed_w_pred_F_ave = DecimalField()
	shrimp_e_pred_F_ave = DecimalField()
	shrimp_w_pred_F_ave = DecimalField()

	hl_e_selex = ListField(DecimalField())
	hl_w_selex = ListField(DecimalField())
	ll_e_selex = ListField(DecimalField())
	ll_w_selex = ListField(DecimalField())
	mrip_e_selex = ListField(DecimalField())
	mrip_w_selex = ListField(DecimalField())
	hbt_e_selex = ListField(DecimalField())
	hbt_w_selex = ListField(DecimalField())
	comm_closed_e_selex = ListField(DecimalField())
	comm_closed_w_selex = ListField(DecimalField())
	rec_closed_e_selex = ListField(DecimalField())
	rec_closed_w_selex = ListField(DecimalField())
	shrimp_e_selex = ListField(DecimalField())
	shrimp_w_selex = ListField(DecimalField())

	hl_e_retention_len = ListField(DecimalField())
	hl_w_retention_len = ListField(DecimalField())
	ll_e_retention_len = ListField(DecimalField())
	ll_w_retention_len = ListField(DecimalField())
	mrip_e_retention_len = ListField(DecimalField())
	mrip_w_retention_len = ListField(DecimalField())
	hbt_e_retention_len = ListField(DecimalField())
	hbt_w_retention_len = ListField(DecimalField())

	total_catch_N = ListField(DecimalField())
	sum_SSB_N = ListField(DecimalField())
	Current_F = ListField(DecimalField())
	Current_SSB = ListField(DecimalField())
	SSB_preyear_1 = ListField(DecimalField())
	SSB_preyear_2 = ListField(DecimalField())
	MSST = DecimalField()
	MFMT = DecimalField()
	Current_F_ratio = DecimalField()
	Current_SSB_ratio = DecimalField()


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

	def pro_name(self):
		if self.process_name:
			return Markup('<button class="mse-buttons" onclick="location.href=\''+url_for('ProcessView.showProStep',pk=str(self.id))+'\'" type="button">'+self.process_name+'</button>')

		else:
			return Markup('')

	def is_public(self):
		try:
		    if current_user.roles[0].name == 'Registered User' and self.created_by.id != current_user.id:
			    return self.process_public

		    if self.process_public is True:
			    return Markup('<input type="checkbox" name="propublic" data-proid='+str(self.id)+' checked data-toggle="toggle">')
		    else:
			    return Markup('<input type="checkbox" name="propublic" data-proid='+str(self.id)+' data-toggle="toggle">')
		except:
			 return Markup('<input type="checkbox" name="propublic" data-proid='+str(self.id)+' data-toggle="toggle">')

	def is_simple(self):
		if self.process_simple is True:
			return Markup('<input type="checkbox" name="prosimple" data-proid='+str(self.id)+' checked data-toggle="toggle">')
		else:
			return Markup('<input type="checkbox" name="prosimple" data-proid='+str(self.id)+' data-toggle="toggle">')

	def advance_compare(self):
		return Markup('<input name="radiopid" type="radio" value="' + str(self.id)+'">')

	def guest_pro_name(self):
		if self.process_name and self.process_description:
			return Markup('<a title="'+self.process_description+'" href="' + url_for('GuestProcessView.guestProStep',pk=str(self.id)) +'">'+self.process_name+'</a>')
		else:
			return Markup('')

class GlobalSettings(Document):

	#STEP1
	stock1_model_type = StringField(max_length=2)
	stock1_input_file_type = StringField(max_length=2)
   	#STEP2
	time_step = StringField(max_length=2)
	start_projection = DateTimeField()
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
	#STEP4
	ip_cv_1 = DecimalField()
	ip_cv_2 = DecimalField()
	iniPopu = EmbeddedDocumentListField(GIIniPopulation)
	#STEP5
	bioParam = EmbeddedDocumentListField(BioParameter)
	#STEP6
	simple_spawning = DecimalField()
	nm_cv_1 = DecimalField()
	nm_cv_2 = DecimalField()
	nm_m = StringField(max_length=2)
	mortality = EmbeddedDocumentListField(Mortality)
	#STEP7
	cvForRecu = DecimalField()
	stock1_amount = DecimalField()
	stock2_amount = DecimalField()
	recruitTypeStock1 = StringField(max_length=2)
	fromHisStock1 = StringField(max_length=2)

	hst1 = ListField(FloatField())  #this is used for calculating custom percentile
	hst1_mean = DecimalField()
	
	hst1_early = ListField(FloatField())   #this is used for calculating custom percentile
	hst1_mean_early = DecimalField()
	
	formulaStock1 = StringField(max_length=2)
	fromFmlStock1 = StringField(max_length=2)
	fml1MbhmSSB0 = DecimalField()
	fml1MbhmR0 = DecimalField()
	fml1MbhmR0_early = DecimalField()
	fml1MbhmSteep = DecimalField()

	#step8
	ssb_msy = DecimalField()
	f_msy = FloatField()
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

	#step 11
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
	extraParam = EmbeddedDocumentField(extraParam)

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

	def to_dict(self):
		return mongo_to_dict(self)

	@classmethod
	def pre_save(cls, sender, document, **kwargs):
		document.changed_on = datetime.datetime.now()

	def initDefaults(self):
		global_settings = GlobalSettings.objects.first()

		self.stock1_model_type = global_settings.stock1_model_type
		self.stock1_input_file_type = global_settings.stock1_input_file_type
		self.time_step = global_settings.time_step
		self.start_projection = global_settings.start_projection
		self.short_term_mgt = global_settings.short_term_mgt
		self.short_term_unit = global_settings.short_term_unit
		self.long_term_mgt = global_settings.long_term_mgt
		self.long_term_unit = global_settings.long_term_unit
		self.stock_per_mgt_unit = global_settings.stock_per_mgt_unit
		self.mixing_pattern = global_settings.mixing_pattern
		self.last_age = global_settings.last_age
		self.no_of_interations = global_settings.no_of_interations
		self.rnd_seed_setting = global_settings.rnd_seed_setting
		self.sample_size = global_settings.sample_size
		self.observ_err_EW_stock = global_settings.observ_err_EW_stock

		self.ip_cv_1 = global_settings.ip_cv_1
		self.ip_cv_2 = global_settings.ip_cv_2
		self.simple_spawning = global_settings.simple_spawning
		self.nm_cv_1 = global_settings.nm_cv_1
		self.nm_cv_2 = global_settings.nm_cv_2
		self.nm_m = global_settings.nm_m

		self.cvForRecu = global_settings.cvForRecu
		self.stock1_amount = global_settings.stock1_amount
		self.stock2_amount = global_settings.stock2_amount
		self.recruitTypeStock1 = global_settings.recruitTypeStock1
		self.formulaStock1 = global_settings.formulaStock1
		self.fromFmlStock1 = global_settings.fromFmlStock1
		self.hst1_mean = global_settings.hst1_mean
		self.hst1_mean_early = global_settings.hst1_mean_early
		self.fml1MbhmSSB0 = global_settings.fml1MbhmSSB0
		self.fml1MbhmR0 = global_settings.fml1MbhmR0
		self.fml1MbhmR0_early = global_settings.fml1MbhmR0_early
		self.fml1MbhmSteep = global_settings.fml1MbhmSteep

		self.bio_catch_mt = global_settings.ssb_msy
		self.bio_f_percent = global_settings.f_msy
		self.hrt_harvest_rule = global_settings.hrt_harvest_rule
		self.mg1_cv = global_settings.mg1_cv
		self.harvest_level = global_settings.harvest_level

		self.sec_recreational = global_settings.sec_recreational
		self.sec_commercial = global_settings.sec_commercial
		self.sec_hire = global_settings.sec_hire
		self.sec_private = global_settings.sec_private
		self.p_e = global_settings.p_e
		self.p_w = global_settings.p_w
		self.sec_headboat = global_settings.sec_headboat
		self.sec_charterboat = global_settings.sec_charterboat
		self.sec_pstar = global_settings.sec_pstar
		self.sec_act_com = global_settings.sec_act_com
		self.sec_act_pri = global_settings.sec_act_pri
		self.sec_act_hire = global_settings.sec_act_hire

		self.alabama = global_settings.alabama
		self.louisiana = global_settings.louisiana
		self.florida = global_settings.florida
		self.mississippi = global_settings.mississippi
		self.texas = global_settings.texas

		self.mg3_commercial = global_settings.mg3_commercial
		self.mg3_recreational = global_settings.mg3_recreational
		self.mg3_forhire = global_settings.mg3_forhire
		self.mg3_private = global_settings.mg3_private
		self.mg3_rec_east_open = global_settings.mg3_rec_east_open
		self.mg3_rec_east_closed = global_settings.mg3_rec_east_closed
		self.mg3_rec_west_open = global_settings.mg3_rec_west_open
		self.mg3_rec_west_closed = global_settings.mg3_rec_west_closed
		self.mg3_comhard_east_open = global_settings.mg3_comhard_east_open
		self.mg3_comhard_west_open = global_settings.mg3_comhard_west_open
		self.mg3_comlong_east_open = global_settings.mg3_comlong_east_open
		self.mg3_comlong_west_open = global_settings.mg3_comlong_west_open
		self.com_stock1_closed = global_settings.com_stock1_closed
		self.com_stock2_closed = global_settings.com_stock2_closed

		self.base_fed_forhire = global_settings.base_fed_forhire
		self.base_AL_private = global_settings.base_AL_private
		self.base_FL_private = global_settings.base_FL_private
		self.base_LA_private = global_settings.base_LA_private
		self.base_MS_private = global_settings.base_MS_private
		self.base_MS_forhire = global_settings.base_MS_forhire
		self.base_TX_private = global_settings.base_TX_private
		self.base_TX_forhire = global_settings.base_TX_forhire
		self.est_fed_forhire = global_settings.base_fed_forhire
		self.est_AL_private = global_settings.base_AL_private
		self.est_FL_private = global_settings.base_FL_private
		self.est_LA_private = global_settings.base_LA_private
		self.est_MS_private = global_settings.base_MS_private
		self.est_MS_forhire = global_settings.base_MS_forhire
		self.est_TX_private = global_settings.base_TX_private
		self.est_TX_forhire = global_settings.base_TX_forhire
		self.season_fed_forhire = global_settings.season_fed_forhire
		self.season_private = global_settings.season_private
		self.fed_forhire_length = global_settings.fed_forhire_length
		
		self.penalty_switch = global_settings.penalty_switch
		self.carryover_switch = global_settings.carryover_switch

		self.AL_private_length = global_settings.AL_private_length
		self.FL_private_length = global_settings.FL_private_length
		self.LA_private_length = global_settings.LA_private_length
		self.MS_private_length = global_settings.MS_private_length
		self.MS_forhire_length = global_settings.MS_forhire_length
		self.TX_private_length = global_settings.TX_private_length
		self.TX_forhire_length = global_settings.TX_forhire_length

signals.pre_save.connect(ProcessGenInput.pre_save, sender=ProcessGenInput)

class MseResultSingle(EmbeddedDocument):

	year = IntField()
	#Essential figures
	#fig 1
	total_catch_median = FloatField()
	total_SSB_median = FloatField()

	#fig 2
	comm_catch_mean = FloatField()
	Forhire_catch_mean = FloatField()
	Private_catch_mean = FloatField()

	#fig 3
	SSB_1_mean = FloatField()
	SSB_2_mean = FloatField()

	#fig 4
	comm_catch_1_mean = FloatField()
	comm_catch_2_mean = FloatField()

	#fig 5
	Forhire_catch_1_mean = FloatField()
	Forhire_catch_2_mean = FloatField()

	#fig 6
	Private_catch_1_mean = FloatField()
	Private_catch_2_mean = FloatField()

	#fig 7
	true_fed_forhire_season_length_median = FloatField()
	true_fed_forhire_season_length_975 = FloatField()
	true_fed_forhire_season_length_025 = FloatField()

	#fig 8 
	true_private_AL_season_length_median = FloatField()
	true_private_FL_season_length_median = FloatField()
	true_private_LA_season_length_median = FloatField()
	true_private_MS_season_length_median = FloatField()
	true_private_TX_season_length_median = FloatField()


	#fig 9
	SSB_total_ratio_median = FloatField() #SSB_ratio_median
	F_general_ratio_median = FloatField()	#F_ratio_median

	#fig 10
	R_1_mean = FloatField()
	R_2_mean = FloatField()

	#Other Figures
	#fig 1
	comm_catch_median = FloatField()
	comm_catch_975 = FloatField()
	comm_catch_025 = FloatField()

	#fig 2
	recr_catch_median = FloatField()
	recr_catch_975 = FloatField()
	recr_catch_025 = FloatField()

	#fig 3 - forhire catch
	Forhire_catch_median = FloatField()
	Forhire_catch_975 = FloatField()
	Forhire_catch_025 = FloatField()

	#fig 4- private catch
	Private_catch_median = FloatField()
	Private_catch_975 = FloatField()
	Private_catch_025 = FloatField()

	#fig 5
	F_general_median = FloatField()
	F_general_975 = FloatField()
	F_general_025 = FloatField()

	#fig 6
	SSB_1_median = FloatField()
	SSB_1_975 = FloatField()
	SSB_1_025 = FloatField()

	#fig 7
	SSB_2_median = FloatField()
	SSB_2_975 = FloatField()
	SSB_2_025 = FloatField()

	#fig 8
	#total_SSB_median
	SSB_total_median = FloatField()
	SSB_total_975 = FloatField()
	SSB_total_025 = FloatField()

	#fig 9
	true_private_AL_catch_median = FloatField()
	true_private_AL_catch_975 = FloatField()
	true_private_AL_catch_025 = FloatField()

	#fig 10 
	#true_private_AL_season_length_median = FloatField()
	true_private_AL_season_length_975 = FloatField()
	true_private_AL_season_length_025 = FloatField()

	#fig 11
	true_private_FL_catch_median = FloatField()
	true_private_FL_catch_975 = FloatField()
	true_private_FL_catch_025 = FloatField()

	#fig 12
	#true_private_FL_season_length_median = FloatField()
	true_private_FL_season_length_975 = FloatField()
	true_private_FL_season_length_025 = FloatField()

	#fig 13
	true_private_LA_catch_median = FloatField()
	true_private_LA_catch_975 = FloatField()
	true_private_LA_catch_025 = FloatField()

	#fig 14
	#true_private_LA_season_length_median = FloatField()
	true_private_LA_season_length_975 = FloatField()
	true_private_LA_season_length_025 = FloatField()

	#fig 15
	true_private_MS_catch_median = FloatField()
	true_private_MS_catch_975 = FloatField()
	true_private_MS_catch_025 = FloatField()

	#fig 16
	#true_private_MS_season_length_median = FloatField()
	true_private_MS_season_length_975 = FloatField()
	true_private_MS_season_length_025 = FloatField()

	#fig 17
	true_private_TX_catch_median = FloatField()
	true_private_TX_catch_975 = FloatField()
	true_private_TX_catch_025 = FloatField()

	#fig 18
	#true_private_TX_season_length_median = FloatField()
	true_private_TX_season_length_975 = FloatField()
	true_private_TX_season_length_025 = FloatField()

class MseCompFields(EmbeddedDocument):
	#Essential Figures
	#Figure 3
	total_catch_median_MSEcomp = FloatField()
	total_catch_upper_MSEcomp = FloatField()
	total_catch_lower_MSEcomp = FloatField()

	#Figure 4
	catch_var_median_MSEcomp = FloatField()
	catch_var_upper_MSEcomp = FloatField()
	catch_var_lower_MSEcomp = FloatField()

	#Figure 5
	terminal_SSB_median_MSEcomp = FloatField()
	terminal_SSB_upper_MSEcomp = FloatField()
	terminal_SSB_lower_MSEcomp = FloatField()

	#Figure 6
	lowest_SSB_median_MSEcomp = FloatField()
	lowest_SSB_upper_MSEcomp = FloatField()
	lowest_SSB_lower_MSEcomp = FloatField()

	#Figure 7
	percent_green_MSEcomp = FloatField()

	#Figure 8
	total_catch_MSEcomp_median = FloatField()
	catch_var_MSEcomp_median = FloatField()
	terminal_SSB_MSEcomp_median = FloatField()
	lowest_SSB_MSEcomp_median = FloatField()

	#Figure 9
	total_discards_median_MSEcomp = FloatField()
	total_discards_upper_MSEcomp = FloatField()
	total_discards_lower_MSEcomp = FloatField()

	#Figure 10
	discards_var_median_MSEcomp = FloatField()
	discards_var_upper_MSEcomp = FloatField()
	discards_var_lower_MSEcomp = FloatField()

	#Other Detailed Figures
	#Section 2:
	#Figure 4
	total_SSB_first5median_median = FloatField()
	total_SSB_first5median_upper = FloatField()
	total_SSB_first5median_lower = FloatField()

	#Figure 5
	total_SSB_last5median_median = FloatField()
	total_SSB_last5median_upper = FloatField()
	total_SSB_last5median_lower = FloatField()

	#Figure 6
	Forhire_catch_first5median = FloatField()
	Private_catch_first5median = FloatField()
	Forhire_catch_last5median = FloatField()
	Private_catch_last5median = FloatField()

	#Figure 7
	true_private_AL_catch_first5median = FloatField()
	true_private_FL_catch_first5median = FloatField()
	true_private_LA_catch_first5median = FloatField()
	true_private_MS_catch_first5median = FloatField()
	true_private_TX_catch_first5median = FloatField()

	#Figure 8
	true_private_AL_catch_last5median = FloatField()
	true_private_FL_catch_last5median = FloatField()
	true_private_LA_catch_last5median = FloatField()
	true_private_MS_catch_last5median = FloatField()
	true_private_TX_catch_last5median = FloatField()

	#Figure 9
	true_private_AL_season_length_first5median = FloatField()
	true_private_FL_season_length_first5median = FloatField()
	true_private_LA_season_length_first5median = FloatField()
	true_private_MS_season_length_first5median = FloatField()
	true_private_TX_season_length_first5median = FloatField()

	#Figure 10
	true_private_AL_season_length_last5median = FloatField()
	true_private_FL_season_length_last5median = FloatField()
	true_private_LA_season_length_last5median = FloatField()
	true_private_MS_season_length_last5median = FloatField()
	true_private_TX_season_length_last5median = FloatField()

	#Figure 11
	total_catch_first5median_median = FloatField()
	total_catch_first5median_upper = FloatField()
	total_catch_first5median_lower = FloatField()

	#Figure 12
	total_catch_last5median_median = FloatField()
	total_catch_last5median_upper = FloatField()
	total_catch_last5median_lower = FloatField()

	#Figure 13
	comm_discards_median = ListField(FloatField())

	#Figure 14
	recr_discards_median = ListField(FloatField())

	#Section 3: Within Sector Comparison
	#Figure 1
	comm_catch_var_MSEcomp = FloatField()
	comm_catch_first5median_MSEcomp = FloatField()
	comm_catch_last5median_MSEcomp = FloatField()
	total_SSB_last5median_MSEcomp = FloatField()
	comm_disalloratio_ave20_MSEcomp = FloatField()
	comm_disalloratio_ave20_MSEcomp = FloatField()

	#Figure 2
	recr_catch_var_MSEcomp = FloatField()
	Forhire_catch_first5median_MSEcomp = FloatField()
	Private_catch_first5median_MSEcomp = FloatField()
	Forhire_catch_last5median_MSEcomp = FloatField()
	Private_catch_last5median_MSEcomp = FloatField()
	recr_disalloratio_ave20_MSEcomp = FloatField()


class MseResultList(Document):

	process_gen_id = StringField(max_length=500,reqired=True)
	resultlist = EmbeddedDocumentListField(MseResultSingle)
	mseCompFields = EmbeddedDocumentField(MseCompFields)

