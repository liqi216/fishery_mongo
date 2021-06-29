#install rmongo package
#####################################################
#install.packages("devtools")
#library(devtools)
#install_github("mongosoup/rmongodb")
#devtools::install_github("r4ss/r4ss",force=TRUE) #, ref="v1.23.1")
#install.packages("RJSONIO")
#install.packages("plyr")
#####################################################

options(digits=16)

#* @filter cors
cors <- function(res) {
  print("Enter cors")
  res$setHeader("Access-Control-Allow-Origin", "*")
  plumber::forward()
}

# This function connect to the database and get one MSE record from Mongodb,
# param: mse_id is the process_gen_id which will get from python code.
getMSEInfo<-function(mse_id){
  print("Enter getMSEInfo")
  library("rmongodb")
  #mongo.create(host = "127.0.0.1", name = "", username = "",password = "", db = "fishery", timeout = 0L)
  result<-mongo.bson.empty()
  mongo <- mongo.create()
  if (mongo.is.connected(mongo)) {
    # read record,use mongo shell to find the value of process_id, replace it in mongo.oid.from.string("5b02cc1b360e2e8f7f93d438"),then execute
    result <- mongo.find.one(mongo, "fishery.process_gen_input", query=list('_id' = mongo.oid.from.string(mse_id)))
  }
  mongo.destroy(mongo)
  return(result)
}

# This function connect to the database and get global settings from Mongodb
getGlobal<-function(){
  print("Enter getGlobal")
  library("rmongodb")
  #mongo.create(host = "127.0.0.1", name = "", username = "",password = "", db = "fishery", timeout = 0L)
  result<-mongo.bson.empty()
  mongo <- mongo.create()
  if (mongo.is.connected(mongo)) {
    # read record,use mongo shell to find the value of process_id, replace it in mongo.oid.from.string("5b02cc1b360e2e8f7f93d438"),then execute
    result <- mongo.find.one(mongo, "fishery.global_settings")
  }
  mongo.destroy(mongo)
  return(result)
}

# This function is used for read random file
# param file_id is the ObjectId get from mse record
# param store_path is the directory where you want to store the file
getRondomFile<-function(file_id,store_path){
  print("Enter getRondomFile")
  library("rmongodb")
  mongo <- mongo.create(host = "127.0.0.1", username = "",password = "", db = "fishery")
  gridfs <- mongo.gridfs.create(mongo, "fishery")
  gf <- mongo.gridfs.find(gridfs, query=list('_id' = mongo.oid.from.string(file_id)))
  filename<-""
  if( !is.null(gf)){
    print(mongo.gridfile.get.length(gf))
    filename <- mongo.gridfile.get.filename(gf)
    print(filename)
    #store file
    setwd(store_path)
    downfile <- file(filename)
    mongo.gridfile.pipe(gf, downfile)
    mongo.gridfile.destroy(gf)
  }

  mongo.gridfs.destroy(gridfs)
  return(filename)
}

# This function is used for save into MongoDb
storeGlobalSetting<-function(store_path,folder_name,ssb_msy,f_msy){
  print("Enter storeGlobalSetting")
  setwd(store_path)
  require(r4ss)
  direct_ofl <- folder_name
  #setwd("/Users/yli120/")
  #direct_ofl <- "OFL"
  # Extract report Files from directories
  dat_ofl <- SS_output(dir = direct_ofl,printstats = T, covar=T, cormax=0.70, forecast=F,printhighcor=50, printlowcor=50)
  base<-dat_ofl
  ##start year and end year
  yr_start<-base$startyr
  #endyear was used in Step 2
  yr_end<-base$endyr
  ########################################################
  #Step 4 initial population, abundance unit 1000  #######
  ########################################################
  age_1<-base$agebins
  stock_1_mean<-c(t(base$natage[(base$natage$Area==1)&(base$natage$Yr==yr_end)&(base$natage$`Beg/Mid`=="B"),as.character(base$agebins)]))
  stock_2_mean<-c(t(base$natage[(base$natage$Area==2)&(base$natage$Yr==yr_end)&(base$natage$`Beg/Mid`=="B"),as.character(base$agebins)]))
  ip_cv_1<-0.2
  ip_cv_2<-0.2
  cv_N_1<-rep(ip_cv_1,length(base$agebins))
  cv_N_2<-rep(ip_cv_2,length(base$agebins))
  iniPopu<-cbind(age_1,stock_1_mean,cv_N_1,stock_2_mean,cv_N_2)
  colnames(iniPopu) <- c("age_1", "stock_1_mean", "cv_1", "stock_2_mean", "cv_2")
  library("RJSONIO")
  library("plyr")
  iniPopuJson<-toJSON(unname(alply(iniPopu,1,identity)))
  ########################################################
  #Step 4 ends                                     #######
  ########################################################

  ########################################################
  #Step 5 biological parameters weight unit kg     #######
  ########################################################
  ##In SS3 fleet 0 contains begin season pop WT, fleet -1 contains mid season pop WT, and fleet -2 contains maturity*fecundity
  # Number of eggs for each individual

  fec_at_age<-c(t(base$ageselex[(base$ageselex$Factor=="Fecund")&(base$ageselex$Yr==yr_end),as.character(base$agebins)]))
  fec_at_age_1<-fec_at_age
  fec_at_age_2<-fec_at_age


  # Biomass for each individual, unit mt
  weight_at_age<-c(t(base$mean_body_wt[(base$mean_body_wt$Yr==yr_start),as.character(base$agebins)]))
  weight_at_age_1<-weight_at_age
  weight_at_age_2<-weight_at_age


  bioPara<-cbind(age_1, weight_at_age_1,fec_at_age_1,weight_at_age_2,fec_at_age_2)
  colnames(bioPara) <- c("age_1", "weight_at_age_1", "fec_at_age_1", "weight_at_age_2", "fec_at_age_2")
  #modified <- list(unname(alply(iniPopu, 1, identity)))
  bioParamJson<-toJSON(unname(alply(bioPara,1,identity)))
  ########################################################
  #Step 5 ends                                     #######
  ########################################################

  ########################################################
  #Step 6 Natural Mortality                        #######
  ########################################################
  #Natural mortality
  #Age-specific natural mortality rates (M) for Gulf of Mexico red snapper assuming a
  #Lorenzen mortality curve rescaled to an average M = 0.0943. The column labeled M represents
  #the average natural mortality experienced from July 1-June 30 (i.e., a birth year). The label Adj.
  #M indicates the values used in the SS3 model to account for SS advancing age on January 1.

  M<-c(t(base$M_at_age[(base$M_at_age$Year==yr_end),as.character(base$agebins)]))
  print("Before Change M:")
  print(M)
  M[length(M)] = M[length(M)-1]
  print("After Change M:")
  print(M)
  for(i.M in 2:length(M)) {
    if(is.na(M[i.M])){
      M[i.M]=M[i.M-1]
    }
  }

  if(unique(base$M_at_age$Bio_Pattern)==1){
    M_1<-M
    M_2<-M
  }
  nm_cv_1<-0.2
  nm_cv_2<-0.2
  cv_M_1<-rep(nm_cv_1,length(base$agebins))
  cv_M_2<-rep(nm_cv_2,length(base$agebins))

  natM<-cbind(age_1,M_1,cv_M_1,M_2,cv_M_2)
  colnames(natM) <- c("age_1","mean_1", "cv_mean_1", "mean_2", "cv_mean_2")
  mortalityParamJson<-toJSON(unname(alply(natM,1,identity)))

  season_factor<-base$seasfracs #simple spawning

  ########################################################
  #Step 6 ends                                     #######
  ########################################################

  ########################################################
  #Step 7 Recruitment                              #######
  ########################################################

  #recruitment, read parameter
  dat6<- base$parameters
  steepness<-base$parameters[base$parameters$Label=="SR_BH_steep","Value"]
  R0_late<-exp(base$parameters[base$parameters$Label=="SR_LN(R0)","Value"]) #unit 1000 R0 after 1984
  #R0_late<-round(R0_late, digits = 1)
  print("R0_late: ")
  print(R0_late)
  R_offset_para<-base$parameters[base$parameters$Label=="SR_envlink","Value"]
  R0_early<-R0_late*exp(R_offset_para)
  #R0_early<-round(R0_early, digits = 1)
  print("R0 early: ")
  print(R0_early)

  SSB0_1<-base$Dynamic_Bzero[(base$Dynamic_Bzero$Era=="VIRG"),"SSB_area1"]
  SSB0_2<-base$Dynamic_Bzero[(base$Dynamic_Bzero$Era=="VIRG"),"SSB_area2"]
  SSB0<-SSB0_1+SSB0_2

  sigma_R<-base$parameters[base$parameters$Label=="SR_sigmaR","Value"] #standard deviation of logged recruitment

  #unit 1000s
  spawning_output_rec_1<-c(t(base$natage[(base$natage$Area==1)&(base$natage$Yr==(yr_end))&(base$natage$`Beg/Mid`=="B"),as.character(base$agebins)]))*fec_at_age_1
  spawning_output_rec_2<-c(t(base$natage[(base$natage$Area==2)&(base$natage$Yr==(yr_end))&(base$natage$`Beg/Mid`=="B"),as.character(base$agebins)]))*fec_at_age_2
  spawning_output_rec<-spawning_output_rec_1+spawning_output_rec_2

  #unit 1000s
  Rhist_1<-base$natage[(base$natage$Area==1)&(base$natage$Yr<=yr_end)&(base$natage$Yr>=yr_start)&(base$natage$`Beg/Mid`=="B"),"0"]
  Rhist_2<-base$natage[(base$natage$Area==2)&(base$natage$Yr<=yr_end)&(base$natage$Yr>=yr_start)&(base$natage$`Beg/Mid`=="B"),"0"]

  Rhist_late<-Rhist_1 + Rhist_2
  Rhist_early<-Rhist_late[(length(Rhist_late)-(yr_end-1984)):length(Rhist_late)]

  Rhist_late_mean<-exp(mean(log(Rhist_late)))
  Rhist_early_mean<-exp(mean(log(Rhist_early)))

  ########################################################
  #Step 7 End                                      #######
  ########################################################

  ########################################################
  #extra variable start                            #######
  ########################################################

  spawning_output_1<-stock_1_mean*fec_at_age_1
  spawning_output_2<-stock_2_mean*fec_at_age_2
  #sum(spawning_output_1) #matches the SA report 4.1 Spawning Output
  #sum(spawning_output_2) #matches the SA report 4.1 Spawning Output

  spawning_output_1_json = toJSON(spawning_output_1)
  spawning_output_2_json = toJSON(spawning_output_2)

  #Age length key
  length_age_key<-base$ALK[,,1]
  length_age_key_stock1<-length_age_key
  length_age_key_stock2<-length_age_key
  length_age_key_row_name<-rownames(length_age_key)


  length_age_key_json = toJSON(length_age_key)
  length_age_key_row_name_json = toJSON(length_age_key_row_name)
  length_age_key_stock1_json = toJSON(length_age_key_stock1)
  length_age_key_stock2_json = toJSON(length_age_key_stock2)


  #F in the last three years, add up together not right
  hl_e_pred_F <- c(t(base$timeseries[(base$timeseries$Yr>=(yr_end-2)) & (base$timeseries$Yr<=yr_end) & is.element(base$timeseries$Area,1) & is.element(base$timeseries$Era,'TIME'),'F:_1']))
  hl_w_pred_F  <- c(t(base$timeseries[(base$timeseries$Yr>=(yr_end-2)) & (base$timeseries$Yr<=yr_end) & is.element(base$timeseries$Area,2) & is.element(base$timeseries$Era,'TIME'),'F:_2']))
  ll_e_pred_F  <- c(t(base$timeseries[(base$timeseries$Yr>=(yr_end-2)) & (base$timeseries$Yr<=yr_end) & is.element(base$timeseries$Area,1) & is.element(base$timeseries$Era,'TIME'),'F:_3']))
  ll_w_pred_F <- c(t(base$timeseries[(base$timeseries$Yr>=(yr_end-2)) & (base$timeseries$Yr<=yr_end) & is.element(base$timeseries$Area,2) & is.element(base$timeseries$Era,'TIME'),'F:_4']))
  mrip_e_pred_F  <- c(t(base$timeseries[(base$timeseries$Yr>=(yr_end-2)) & (base$timeseries$Yr<=yr_end) & is.element(base$timeseries$Area,1) & is.element(base$timeseries$Era,'TIME'),'F:_5']))
  mrip_w_pred_F  <- c(t(base$timeseries[(base$timeseries$Yr>=(yr_end-2)) & (base$timeseries$Yr<=yr_end) & is.element(base$timeseries$Area,2) & is.element(base$timeseries$Era,'TIME'),'F:_6']))
  hbt_e_pred_F  <- c(t(base$timeseries[(base$timeseries$Yr>=(yr_end-2)) & (base$timeseries$Yr<=yr_end) & is.element(base$timeseries$Area,1) & is.element(base$timeseries$Era,'TIME'),'F:_7']))
  hbt_w_pred_F  <- c(t(base$timeseries[(base$timeseries$Yr>=(yr_end-2)) & (base$timeseries$Yr<=yr_end) & is.element(base$timeseries$Area,2) & is.element(base$timeseries$Era,'TIME'),'F:_8']))
  comm_closed_e_pred_F <- c(t(base$timeseries[(base$timeseries$Yr>=(yr_end-2)) & (base$timeseries$Yr<=yr_end) & is.element(base$timeseries$Area,1) & is.element(base$timeseries$Era,'TIME'),'F:_9']))
  comm_closed_w_pred_F <- c(t(base$timeseries[(base$timeseries$Yr>=(yr_end-2)) & (base$timeseries$Yr<=yr_end) & is.element(base$timeseries$Area,2) & is.element(base$timeseries$Era,'TIME'),'F:_10']))
  rec_closed_e_pred_F <- c(t(base$timeseries[(base$timeseries$Yr>=(yr_end-2)) & (base$timeseries$Yr<=yr_end) & is.element(base$timeseries$Area,1) & is.element(base$timeseries$Era,'TIME'),'F:_11']))
  rec_closed_w_pred_F <- c(t(base$timeseries[(base$timeseries$Yr>=(yr_end-2)) & (base$timeseries$Yr<=yr_end) & is.element(base$timeseries$Area,2) & is.element(base$timeseries$Era,'TIME'),'F:_12']))
  shrimp_e_pred_F <- c(t(base$timeseries[(base$timeseries$Yr>=(yr_end-2)) & (base$timeseries$Yr<=yr_end) & is.element(base$timeseries$Area,1) & is.element(base$timeseries$Era,'TIME'),'F:_13']))
  shrimp_w_pred_F <- c(t(base$timeseries[(base$timeseries$Yr>=(yr_end-2)) & (base$timeseries$Yr<=yr_end) & is.element(base$timeseries$Area,2) & is.element(base$timeseries$Era,'TIME'),'F:_14']))

  #extraF<-cbind(hl_e_pred_F, hl_w_pred_F,ll_e_pred_F,ll_w_pred_F,mrip_e_pred_F,mrip_w_pred_F,hbt_e_pred_F,hbt_w_pred_F,comm_closed_e_pred_F,comm_closed_w_pred_F,rec_closed_e_pred_F,rec_closed_w_pred_F,shrimp_e_pred_F,shrimp_w_pred_F)
  #colnames(extraF) <- c("hl_e_pred_F","hl_w_pred_F", "ll_e_pred_F", "ll_w_pred_F","mrip_e_pred_F","mrip_w_pred_F", "hbt_e_pred_F", "hbt_w_pred_F","comm_closed_e_pred_F","comm_closed_w_pred_F", "rec_closed_e_pred_F", "rec_closed_w_pred_F","shrimp_e_pred_F","shrimp_w_pred_F")
  #extraFJson<-toJSON(unname(alply(extraF,1,identity)))

  hl_e_pred_F_ave <- mean(hl_e_pred_F)
  hl_w_pred_F_ave <- mean(hl_w_pred_F)
  ll_e_pred_F_ave <- mean(ll_e_pred_F)
  ll_w_pred_F_ave <- mean(ll_w_pred_F)
  mrip_e_pred_F_ave <- mean(mrip_e_pred_F)
  mrip_w_pred_F_ave <- mean(mrip_w_pred_F)
  hbt_e_pred_F_ave <- mean(hbt_e_pred_F)
  hbt_w_pred_F_ave <- mean(hbt_w_pred_F)
  comm_closed_e_pred_F_ave <- mean(comm_closed_e_pred_F)
  comm_closed_w_pred_F_ave <- mean(comm_closed_w_pred_F)
  rec_closed_e_pred_F_ave <- mean(rec_closed_e_pred_F)
  rec_closed_w_pred_F_ave <- mean(rec_closed_w_pred_F)
  shrimp_e_pred_F_ave <- mean(shrimp_e_pred_F)
  shrimp_w_pred_F_ave <- mean(shrimp_w_pred_F)

  hl_e_pred_F_ave_json = toJSON(hl_e_pred_F_ave)
  hl_w_pred_F_ave_json = toJSON(hl_w_pred_F_ave)
  ll_e_pred_F_ave_json = toJSON(ll_e_pred_F_ave)
  ll_w_pred_F_ave_json = toJSON(ll_w_pred_F_ave)
  mrip_e_pred_F_ave_json = toJSON(mrip_e_pred_F_ave)
  mrip_w_pred_F_ave_json = toJSON(mrip_w_pred_F_ave)
  hbt_e_pred_F_ave_json = toJSON(hbt_e_pred_F_ave)
  hbt_w_pred_F_ave_json = toJSON(hbt_w_pred_F_ave)
  comm_closed_e_pred_F_ave_json = toJSON(comm_closed_e_pred_F_ave)
  comm_closed_w_pred_F_ave_json = toJSON(comm_closed_w_pred_F_ave)
  rec_closed_e_pred_F_ave_json = toJSON(rec_closed_e_pred_F_ave)
  rec_closed_w_pred_F_ave_json = toJSON(rec_closed_w_pred_F_ave)
  shrimp_e_pred_F_ave_json = toJSON(shrimp_e_pred_F_ave)
  shrimp_w_pred_F_ave_json = toJSON(shrimp_w_pred_F_ave)

  #Last year selectivity
  hl_e_selex <- c(t(base$ageselex[(base$ageselex$Yr==yr_end) & is.element(base$ageselex$Factor,"Asel") & is.element(base$ageselex$Fleet,1), as.character(base$agebins)]))
  hl_w_selex   <- c(t(base$ageselex[(base$ageselex$Yr==yr_end) & is.element(base$ageselex$Factor,"Asel") & is.element(base$ageselex$Fleet,2), as.character(base$agebins)]))
  ll_e_selex  <- c(t(base$ageselex[(base$ageselex$Yr==yr_end) & is.element(base$ageselex$Factor,"Asel") & is.element(base$ageselex$Fleet,3), as.character(base$agebins)]))
  ll_w_selex  <- c(t(base$ageselex[(base$ageselex$Yr==yr_end) & is.element(base$ageselex$Factor,"Asel") & is.element(base$ageselex$Fleet,4), as.character(base$agebins)]))
  mrip_e_selex   <- c(t(base$ageselex[(base$ageselex$Yr==yr_end) & is.element(base$ageselex$Factor,"Asel") & is.element(base$ageselex$Fleet,5), as.character(base$agebins)]))
  mrip_w_selex  <- c(t(base$ageselex[(base$ageselex$Yr==yr_end) & is.element(base$ageselex$Factor,"Asel") & is.element(base$ageselex$Fleet,6), as.character(base$agebins)]))
  hbt_e_selex   <- c(t(base$ageselex[(base$ageselex$Yr==yr_end) & is.element(base$ageselex$Factor,"Asel") & is.element(base$ageselex$Fleet,7), as.character(base$agebins)]))
  hbt_w_selex   <- c(t(base$ageselex[(base$ageselex$Yr==yr_end) & is.element(base$ageselex$Factor,"Asel") & is.element(base$ageselex$Fleet,8), as.character(base$agebins)]))
  comm_closed_e_selex  <- c(t(base$ageselex[(base$ageselex$Yr==yr_end) & is.element(base$ageselex$Factor,"Asel") & is.element(base$ageselex$Fleet,9), as.character(base$agebins)]))
  comm_closed_w_selex  <- c(t(base$ageselex[(base$ageselex$Yr==yr_end) & is.element(base$ageselex$Factor,"Asel") & is.element(base$ageselex$Fleet,10), as.character(base$agebins)]))
  rec_closed_e_selex  <- c(t(base$ageselex[(base$ageselex$Yr==yr_end) & is.element(base$ageselex$Factor,"Asel") & is.element(base$ageselex$Fleet,11), as.character(base$agebins)]))
  rec_closed_w_selex  <- c(t(base$ageselex[(base$ageselex$Yr==yr_end) & is.element(base$ageselex$Factor,"Asel") & is.element(base$ageselex$Fleet,12), as.character(base$agebins)]))
  shrimp_e_selex  <- c(t(base$ageselex[(base$ageselex$Yr==yr_end) & is.element(base$ageselex$Factor,"Asel") & is.element(base$ageselex$Fleet,13), as.character(base$agebins)]))
  shrimp_w_selex  <- c(t(base$ageselex[(base$ageselex$Yr==yr_end) & is.element(base$ageselex$Factor,"Asel") & is.element(base$ageselex$Fleet,14), as.character(base$agebins)]))

  hl_e_selex_json = toJSON(hl_e_selex)
  hl_w_selex_json = toJSON(hl_w_selex)
  ll_e_selex_json = toJSON(ll_e_selex)
  ll_w_selex_json = toJSON(ll_w_selex)
  mrip_e_selex_json = toJSON(mrip_e_selex)
  mrip_w_selex_json = toJSON(mrip_w_selex)
  hbt_e_selex_json = toJSON(hbt_e_selex)
  hbt_w_selex_json = toJSON(hbt_w_selex)
  comm_closed_e_selex_json = toJSON(comm_closed_e_selex)
  comm_closed_w_selex_json = toJSON(comm_closed_w_selex)
  rec_closed_e_selex_json = toJSON(rec_closed_e_selex)
  rec_closed_w_selex_json = toJSON(rec_closed_w_selex)
  shrimp_e_selex_json = toJSON(shrimp_e_selex)
  shrimp_w_selex_json = toJSON(shrimp_w_selex)

  #Last year retention rate for fleet 9-14, retention rate 0.
  hl_e_retention_len<-base$sizeselex[(base$sizeselex$Yr==yr_end) & is.element(base$sizeselex$Factor,"Ret") & is.element(base$sizeselex$Fleet,1), 6:dim(base$sizeselex)[2]]
  #hl_e_retention_multiplier<-hl_e_retention_len[length(hl_e_retention_len)]
  hl_w_retention_len<-base$sizeselex[(base$sizeselex$Yr==yr_end) & is.element(base$sizeselex$Factor,"Ret") & is.element(base$sizeselex$Fleet,2), 6:dim(base$sizeselex)[2]]
  #hl_w_retention_multiplier<-hl_w_retention_len[length(hl_w_retention_len)]

  ll_e_retention_len<-base$sizeselex[(base$sizeselex$Yr==yr_end) & is.element(base$sizeselex$Factor,"Ret") & is.element(base$sizeselex$Fleet,3), 6:dim(base$sizeselex)[2]]
  #ll_e_retention_multiplier<-ll_e_retention[length(ll_e_retention)]
  ll_w_retention_len<-base$sizeselex[(base$sizeselex$Yr==yr_end) & is.element(base$sizeselex$Factor,"Ret") & is.element(base$sizeselex$Fleet,4), 6:dim(base$sizeselex)[2]]
  #ll_w_retention_multiplier<-ll_w_retention[length(ll_w_retention)]

  mrip_e_retention_len<-base$sizeselex[(base$sizeselex$Yr==yr_end) & is.element(base$sizeselex$Factor,"Ret") & is.element(base$sizeselex$Fleet,5), 6:dim(base$sizeselex)[2]]
  #mrip_e_retention_multiplier<-mrip_e_retention[length(mrip_e_retention)]
  mrip_w_retention_len<-base$sizeselex[(base$sizeselex$Yr==yr_end) & is.element(base$sizeselex$Factor,"Ret") & is.element(base$sizeselex$Fleet,6), 6:dim(base$sizeselex)[2]]
  #mrip_w_retention_multiplier<-mrip_w_retention[length(mrip_w_retention)]

  hbt_e_retention_len<-base$sizeselex[(base$sizeselex$Yr==yr_end) & is.element(base$sizeselex$Factor,"Ret") & is.element(base$sizeselex$Fleet,7), 6:dim(base$sizeselex)[2]]
  #hbt_e_retention_multiplier<-hbt_e_retention[length(hbt_e_retention)]
  hbt_w_retention_len<-base$sizeselex[(base$sizeselex$Yr==yr_end) & is.element(base$sizeselex$Factor,"Ret") & is.element(base$sizeselex$Fleet,8), 6:dim(base$sizeselex)[2]]
  #hbt_w_retention_multiplier<-hbt_w_retention[length(hbt_w_retention)]

  hl_e_retention_len_json = toJSON(hl_e_retention_len)
  hl_w_retention_len_json = toJSON(hl_w_retention_len)
  ll_e_retention_len_json = toJSON(ll_e_retention_len)
  ll_w_retention_len_json = toJSON(ll_w_retention_len)
  mrip_e_retention_len_json = toJSON(mrip_e_retention_len)
  mrip_w_retention_len_json = toJSON(mrip_w_retention_len)
  hbt_e_retention_len_json = toJSON(hbt_e_retention_len)
  hbt_w_retention_len_json = toJSON(hbt_w_retention_len)

  #fisheries status
  #Catch number in the last three years unit 1000s
  #hl_e_pred_cat_N <- c(t(base$timeseries[(base$timeseries$Yr>=(yr_end-2)) & (base$timeseries$Yr<=yr_end) & is.element(base$timeseries$Area,1) & is.element(base$timeseries$Era,'TIME'),'retain(N):_1']))
  #hl_w_pred_cat_N  <- c(t(base$timeseries[(base$timeseries$Yr>=(yr_end-2)) & (base$timeseries$Yr<=yr_end) & is.element(base$timeseries$Area,2) & is.element(base$timeseries$Era,'TIME'),'retain(N):_2']))
  #ll_e_pred_cat_N  <- c(t(base$timeseries[(base$timeseries$Yr>=(yr_end-2)) & (base$timeseries$Yr<=yr_end) & is.element(base$timeseries$Area,1) & is.element(base$timeseries$Era,'TIME'),'retain(N):_3']))
  #ll_w_pred_cat_N <- c(t(base$timeseries[(base$timeseries$Yr>=(yr_end-2)) & (base$timeseries$Yr<=yr_end) & is.element(base$timeseries$Area,2) & is.element(base$timeseries$Era,'TIME'),'retain(N):_4']))
  #mrip_e_pred_cat_N  <- c(t(base$timeseries[(base$timeseries$Yr>=(yr_end-2)) & (base$timeseries$Yr<=yr_end) & is.element(base$timeseries$Area,1) & is.element(base$timeseries$Era,'TIME'),'retain(N):_5']))
  #mrip_w_pred_cat_N  <- c(t(base$timeseries[(base$timeseries$Yr>=(yr_end-2)) & (base$timeseries$Yr<=yr_end) & is.element(base$timeseries$Area,2) & is.element(base$timeseries$Era,'TIME'),'retain(N):_6']))
  #hbt_e_pred_cat_N  <- c(t(base$timeseries[(base$timeseries$Yr>=(yr_end-2)) & (base$timeseries$Yr<=yr_end) & is.element(base$timeseries$Area,1) & is.element(base$timeseries$Era,'TIME'),'retain(N):_7']))
  #hbt_w_pred_cat_N  <- c(t(base$timeseries[(base$timeseries$Yr>=(yr_end-2)) & (base$timeseries$Yr<=yr_end) & is.element(base$timeseries$Area,2) & is.element(base$timeseries$Era,'TIME'),'retain(N):_8']))
  hl_e_pred_cat_N <- c(t(base$timeseries[(base$timeseries$Yr>=(yr_end-2)) & (base$timeseries$Yr<=yr_end) & is.element(base$timeseries$Area,1) & is.element(base$timeseries$Era,'TIME'),'dead(N):_1']))
  hl_w_pred_cat_N  <- c(t(base$timeseries[(base$timeseries$Yr>=(yr_end-2)) & (base$timeseries$Yr<=yr_end) & is.element(base$timeseries$Area,2) & is.element(base$timeseries$Era,'TIME'),'dead(N):_2']))
  ll_e_pred_cat_N  <- c(t(base$timeseries[(base$timeseries$Yr>=(yr_end-2)) & (base$timeseries$Yr<=yr_end) & is.element(base$timeseries$Area,1) & is.element(base$timeseries$Era,'TIME'),'dead(N):_3']))
  ll_w_pred_cat_N <- c(t(base$timeseries[(base$timeseries$Yr>=(yr_end-2)) & (base$timeseries$Yr<=yr_end) & is.element(base$timeseries$Area,2) & is.element(base$timeseries$Era,'TIME'),'dead(N):_4']))
  mrip_e_pred_cat_N  <- c(t(base$timeseries[(base$timeseries$Yr>=(yr_end-2)) & (base$timeseries$Yr<=yr_end) & is.element(base$timeseries$Area,1) & is.element(base$timeseries$Era,'TIME'),'dead(N):_5']))
  mrip_w_pred_cat_N  <- c(t(base$timeseries[(base$timeseries$Yr>=(yr_end-2)) & (base$timeseries$Yr<=yr_end) & is.element(base$timeseries$Area,2) & is.element(base$timeseries$Era,'TIME'),'dead(N):_6']))
  hbt_e_pred_cat_N  <- c(t(base$timeseries[(base$timeseries$Yr>=(yr_end-2)) & (base$timeseries$Yr<=yr_end) & is.element(base$timeseries$Area,1) & is.element(base$timeseries$Era,'TIME'),'dead(N):_7']))
  hbt_w_pred_cat_N  <- c(t(base$timeseries[(base$timeseries$Yr>=(yr_end-2)) & (base$timeseries$Yr<=yr_end) & is.element(base$timeseries$Area,2) & is.element(base$timeseries$Era,'TIME'),'dead(N):_8']))
  comm_closed_e_cat_N <- c(t(base$timeseries[(base$timeseries$Yr>=(yr_end-2)) & (base$timeseries$Yr<=yr_end) & is.element(base$timeseries$Area,1) & is.element(base$timeseries$Era,'TIME'),'dead(N):_9']))
  comm_closed_w_cat_N <- c(t(base$timeseries[(base$timeseries$Yr>=(yr_end-2)) & (base$timeseries$Yr<=yr_end) & is.element(base$timeseries$Area,2) & is.element(base$timeseries$Era,'TIME'),'dead(N):_10']))
  rec_closed_e_cat_N <- c(t(base$timeseries[(base$timeseries$Yr>=(yr_end-2)) & (base$timeseries$Yr<=yr_end) & is.element(base$timeseries$Area,1) & is.element(base$timeseries$Era,'TIME'),'dead(N):_11']))
  rec_closed_w_cat_N <- c(t(base$timeseries[(base$timeseries$Yr>=(yr_end-2)) & (base$timeseries$Yr<=yr_end) & is.element(base$timeseries$Area,2) & is.element(base$timeseries$Era,'TIME'),'dead(N):_12']))
  shrimp_e_cat_N <- c(t(base$timeseries[(base$timeseries$Yr>=(yr_end-2)) & (base$timeseries$Yr<=yr_end) & is.element(base$timeseries$Area,1) & is.element(base$timeseries$Era,'TIME'),'dead(N):_13']))
  shrimp_w_cat_N <- c(t(base$timeseries[(base$timeseries$Yr>=(yr_end-2)) & (base$timeseries$Yr<=yr_end) & is.element(base$timeseries$Area,2) & is.element(base$timeseries$Era,'TIME'),'dead(N):_14']))

  # Ratio_hl_east<-mean(hl_e_pred_cat_N/(hl_e_pred_cat_N+ll_e_pred_cat_N+hl_w_pred_cat_N+ll_w_pred_cat_N))
  # Ratio_ll_east<-mean(ll_e_pred_cat_N/(hl_e_pred_cat_N+ll_e_pred_cat_N+hl_w_pred_cat_N+ll_w_pred_cat_N))
  # Ratio_hl_west<-mean(hl_w_pred_cat_N/(hl_e_pred_cat_N+ll_e_pred_cat_N+hl_w_pred_cat_N+ll_w_pred_cat_N))
  # Ratio_ll_west<- 1-(Ratio_hl_east + Ratio_ll_east + Ratio_hl_west)
  # Ratio_hl_east_json = toJSON(Ratio_hl_east)
  # Ratio_ll_east_json = toJSON(Ratio_ll_east)
  # Ratio_hl_west_json = toJSON(Ratio_hl_west)
  # Ratio_ll_west_json = toJSON(Ratio_ll_west)

  stock_1_N<-base$natage[(base$natage$Area==1)&(base$natage$Yr>=(yr_end-2))&(base$natage$Yr<=yr_end)&(base$natage$`Beg/Mid`=="B"),as.character(base$agebins)]
  stock_2_N<-base$natage[(base$natage$Area==2)&(base$natage$Yr>=(yr_end-2))&(base$natage$Yr<=yr_end)&(base$natage$`Beg/Mid`=="B"),as.character(base$agebins)]

  total_catch_N <-  (hl_e_pred_cat_N + hl_w_pred_cat_N + ll_e_pred_cat_N + ll_w_pred_cat_N
                     + mrip_e_pred_cat_N + mrip_w_pred_cat_N + hbt_e_pred_cat_N + hbt_w_pred_cat_N
                     + comm_closed_e_cat_N + comm_closed_w_cat_N + rec_closed_e_cat_N + rec_closed_w_cat_N
                     + shrimp_e_cat_N + shrimp_w_cat_N)
  total_catch_N_json = toJSON(total_catch_N)

  #sum_N
  sum_N <- c(t(rowSums(stock_1_N)+rowSums(stock_2_N)))
  sum_N_json = toJSON(sum_N)

  Current_F<-mean(total_catch_N/sum_N)
  Current_SSB<-sum(spawning_output_1+spawning_output_2)
  Current_F_json = toJSON(Current_F)
  Current_SSB_json = toJSON(Current_SSB)

  #Other parameters might be useful
  midyearweight_at_age<-c(t(base$ageselex[(base$ageselex$Yr==yr_start)&is.element(base$ageselex$Factor,"bodywt")&is.element(base$ageselex$Fleet,"1"),as.character(base$agebins)]))
  midyearweight_at_age_1<-midyearweight_at_age
  midyearweight_at_age_2<-midyearweight_at_age

  stock_1_mean_preyear<-c(t(base$natage[(base$natage$Area==1)&(base$natage$Yr==(yr_end-1))&(base$natage$`Beg/Mid`=="B"),as.character(base$agebins)]))
  stock_2_mean_preyear<-c(t(base$natage[(base$natage$Area==2)&(base$natage$Yr==(yr_end-1))&(base$natage$`Beg/Mid`=="B"),as.character(base$agebins)]))

  SSB_preyear_1<-stock_1_mean*fec_at_age_1
  print("stock_1_mean")
  print(stock_1_mean)
  print("fec_at_age_1")
  print(fec_at_age_1)
  SSB_preyear_2<-stock_2_mean*fec_at_age_2
  SSB_preyear_1_json = toJSON(SSB_preyear_1)
  SSB_preyear_2_json = toJSON(SSB_preyear_2)

  SSB_MSY_BRP<-as.numeric(ssb_msy)/1000   #unit 1000 eggs - e+12
  F_MSY_BRP<-as.numeric(f_msy)

  MSST<-0.5*SSB_MSY_BRP
  MFMT<-F_MSY_BRP
  MSST_json = toJSON(MSST)
  MFMT_json = toJSON(MFMT)

  #Position of the year 2016 in the traffic light
  Current_F_ratio<-Current_F/MFMT
  Current_SSB_ratio<-Current_SSB/SSB_MSY_BRP
  Current_F_ratio_json = toJSON(Current_F_ratio)
  Current_SSB_ratio_json = toJSON(Current_SSB_ratio)

  extraParamJson<-paste('{"spawning_output_1":',spawning_output_1_json,',"spawning_output_2":',spawning_output_2_json
                        ,',"length_age_key":',length_age_key_json,',"length_age_key_row_name":',length_age_key_row_name_json,',"length_age_key_stock1":',length_age_key_stock1_json,',"length_age_key_stock2":',length_age_key_stock2_json
                        ,',"hl_e_pred_F_ave":',hl_e_pred_F_ave_json,',"hl_w_pred_F_ave":',hl_w_pred_F_ave_json,',"ll_e_pred_F_ave":',ll_e_pred_F_ave_json,',"ll_w_pred_F_ave":',ll_w_pred_F_ave_json
                        ,',"mrip_e_pred_F_ave":',mrip_e_pred_F_ave_json,',"mrip_w_pred_F_ave":',mrip_w_pred_F_ave_json,',"hbt_e_pred_F_ave":',hbt_e_pred_F_ave_json,',"hbt_w_pred_F_ave":',hbt_w_pred_F_ave_json
                        ,',"comm_closed_e_pred_F_ave":',comm_closed_e_pred_F_ave_json,',"comm_closed_w_pred_F_ave":',comm_closed_w_pred_F_ave_json
                        ,',"rec_closed_e_pred_F_ave":',rec_closed_e_pred_F_ave_json,',"rec_closed_w_pred_F_ave":',rec_closed_w_pred_F_ave_json
                        ,',"shrimp_e_pred_F_ave":',shrimp_e_pred_F_ave_json,',"shrimp_w_pred_F_ave":',shrimp_w_pred_F_ave_json
                        ,',"hl_e_selex":',hl_e_selex_json,',"hl_w_selex":',hl_w_selex_json,',"ll_e_selex":',ll_e_selex_json,',"ll_w_selex":',ll_w_selex_json
                        ,',"mrip_e_selex":',mrip_e_selex_json,',"mrip_w_selex":',mrip_w_selex_json,',"hbt_e_selex":',hbt_e_selex_json,',"hbt_w_selex":',hbt_w_selex_json
                        ,',"comm_closed_e_selex":',comm_closed_e_selex_json,',"comm_closed_w_selex":',comm_closed_w_selex_json
                        ,',"rec_closed_e_selex":',rec_closed_e_selex_json,',"rec_closed_w_selex":',rec_closed_w_selex_json,',"shrimp_e_selex":',shrimp_e_selex_json,',"shrimp_w_selex":',shrimp_w_selex_json
                        ,',"hl_e_retention_len":',hl_e_retention_len_json,',"hl_w_retention_len":',hl_w_retention_len_json,',"ll_e_retention_len":',ll_e_retention_len_json,',"ll_w_retention_len":',ll_w_retention_len_json
                        ,',"mrip_e_retention_len":',mrip_e_retention_len_json,',"mrip_w_retention_len":',mrip_w_retention_len_json
                        ,',"hbt_e_retention_len":',hbt_e_retention_len_json,',"hbt_w_retention_len":',hbt_w_retention_len_json
                        ,',"total_catch_N":',total_catch_N_json,',"sum_SSB_N":',sum_N_json,',"SSB_preyear_1":',SSB_preyear_1_json,',"SSB_preyear_2":',SSB_preyear_2_json,',"Current_F":',Current_F_json
                        ,',"MSST":',MSST_json,',"MFMT":',MFMT_json,',"Current_F_ratio":',Current_F_ratio_json,',"Current_SSB_ratio":',Current_SSB_ratio_json
                        ,'}',sep = "")

  ########################################################
  #extra variable end                              #######
  ########################################################

  library("rmongodb")
  #library("rmongodbHelper")
  mongo <- mongo.create(host = "127.0.0.1", username = "",password = "", db = "fishery")
  start_projection <- as.Date('2016/01/01')
  Rhist_late_json <- toJSON(Rhist_late)
  Rhist_early_json <- toJSON(Rhist_early)

  jsondata <- paste('{"stock1_model_type":"1","stock1_input_file_type":"1","time_step":"Y","start_projection":"',start_projection,'","short_term_mgt":3,"short_term_unit":"Y","long_term_mgt":20,"long_term_unit":"Y","stock_per_mgt_unit":2,"mixing_pattern":"0","last_age":20,"no_of_interations":100,"sample_size":1000,"observ_err_EW_stock":1000,"rnd_seed_setting":"2","iniPopu":',iniPopuJson
                    ,',"ip_cv_1":',ip_cv_1,',"ip_cv_2":',ip_cv_2,',"bioParam":',bioParamJson,',"nm_cv_1":',nm_cv_1,',"nm_cv_2":',nm_cv_2,',"nm_m":"c","mortality":',mortalityParamJson,',"simple_spawning":',season_factor 
                    ,',"cvForRecu":',sigma_R,',"stock1_amount":23,"stock2_amount":77,"recruitTypeStock1":"2","formulaStock1":"1","fromFmlStock1":"2","fml1MbhmSSB0":',SSB0,',"fml1MbhmR0":',R0_late,',"fml1MbhmR0_early":',R0_early,',"fml1MbhmSteep":',steepness
                    ,',"hst1":',Rhist_late_json,',"hst1_mean":',Rhist_late_mean,',"hst1_early":',Rhist_early_json,',"hst1_mean_early":',Rhist_early_mean
                    ,',"ssb_msy":',ssb_msy,',"f_msy":',f_msy,',"hrt_harvest_rule":"CF","mg1_cv":0.2,"harvest_level":0.0564'
                    ,',"sec_recreational":49,"sec_commercial":51,"sec_hire":42.3,"sec_private":57.7,"sec_headboat":72.2,"sec_charterboat":27.8,"sec_pstar":40,"sec_act_com":0,"sec_act_pri":20,"sec_act_hire":9,"p_e":80.2,"p_w":19.8'
                    ,',"mg3_commercial":13,"mg3_recreational":16,"mg3_forhire":2,"mg3_private":2,"mg3_rec_east_open":11.8,"mg3_rec_east_closed":11.8,"mg3_rec_west_open":11.8,"mg3_rec_west_closed":11.8'
                    ,',"mg3_comhard_east_open":56,"mg3_comhard_west_open":60,"mg3_comlong_east_open":64,"mg3_comlong_west_open":81,"com_stock1_closed":55,"com_stock2_closed":74'
                    ,',"base_fed_forhire":46077,"base_AL_private":35225,"base_FL_private":50176,"base_LA_private":7783,"base_MS_private":1823,"base_MS_forhire":176,"base_TX_private":2880,"base_TX_forhire":225,"season_fed_forhire":"1","fed_forhire_length":62,"season_private":"1","AL_private_length":36,"FL_private_length":38,"LA_private_length":109,"MS_private_length":81,"MS_forhire_length":17,"TX_private_length":62,"TX_forhire_length":365'
                    ,',"alabama":26.298,"florida":44.822,"louisiana":19.12,"mississippi":3.55,"texas":6.21'
                    ,',"penalty_switch":"1","carryover_switch":"0"'
                    ,',"extraParam":',extraParamJson,'}',sep = "")

  print(jsondata)
  #global_content<-json_to_bson(jsondata)
  global_content<-mongo.bson.from.JSON(jsondata)
  print(global_content)
  mongo.remove(mongo,"fishery.global_settings")
  mongo.insert(mongo,"fishery.global_settings",global_content)

}

# This function is used for save global zip file and unzip it, then invoke analytic function to get value and save into global settings.
# param file_id is the ObjectId get from mse record
# param store_path is the directory where you want to store the file
#' @param file_id The gridfs file id
#' @param store_path file saved directory
#' @serializer unboxedJSON
#' @post /defaultFile
function(file_id,store_path,ssb_msy,f_msy){
  print("Enter func1")
  library("rmongodb")
  mongo <- mongo.create(host = "127.0.0.1", username = "",password = "", db = "fishery")
  print(mongo.is.connected(mongo))
  gridfs <- mongo.gridfs.create(mongo, "fishery")
  print(file_id)
  gf <- mongo.gridfs.find(gridfs, query=list('_id' = mongo.oid.from.string(file_id)))

  if( !is.null(gf)){
    #print(mongo.gridfile.get.length(gf))
    filename <- mongo.gridfile.get.filename(gf)
    print(filename)
    #store file
    print(store_path)
    curr <- getwd()
    print(curr)
    setwd(store_path)
    downfile <- file(filename)
    mongo.gridfile.pipe(gf, downfile)
    mongo.gridfile.destroy(gf)
    unzip(filename)
  }else{
    print("in else")
  }
  mongo.gridfs.destroy(gridfs)
  split_filename<-unlist(strsplit(filename, "\\."))
  storeGlobalSetting(store_path,split_filename[1],ssb_msy,f_msy)
}
# This function is used for Run MSE and get result.
#' @serializer unboxedJSON
#' @post /runmse
function(process_gen_id){
  print("Enter func2")
  ##########################################################
  ###### Get Database User Interface Value Start ###########
  ##########################################################

  mse_result <- getMSEInfo(process_gen_id)
  #mse_result <- getMSEInfo('5c361ea5360e2ed89687b607')

  #Options, in the webpage, these value should be read from the database
  
  ### general input ###

  ### never used variables, ignore begin ####
  time_step_switch<-2 # 1: half year, 2: 1 year.  12312018 currently only year.
  mixing_pattern_switch<-1 # 1: no mixing, 2: constant, 3: same over year, 4: time varies 12312018 currently only no mixing
  ### never used variables, ignore end ####

  ####   no use, just keep it, start #######
  seed_switch<-2 #1: system clock 2: default, 3: self-defind
  if(seed_switch==1){#use system clock
  }else if(seed_switch==2){
    #use default file
  }else if(seed_switch==3){
    #use self uploaded path
  }

  plusage<-20 #currently can not change
  age_1<-0:plusage
  age_2<-age_1

  ####   no use, just keep it, end #######

  project_start_year<-as.numeric(substring(as.Date(mongo.bson.value(mse_result, "start_projection")),0,4))

  #StockAssInterval<-mongo.bson.value(mse_result, "short_term_mgt") # unit year
  Runtime_short<-100
  Runtime_long<-mongo.bson.value(mse_result, "long_term_mgt") # unit year
  Simrun_Num<-mongo.bson.value(mse_result, "no_of_interations")
  IniN_Ess_Num<-mongo.bson.value(mse_result, "sample_size")
  rnd_file_list<-mongo.bson.value(mse_result, "rnd_seed_file")
  rnd_file_name<-getRondomFile(mongo.oid.to.string(rnd_file_list[1]$`0`),"~/")
  seed_input<-read.csv(rnd_file_name,header = F)

  ### Mixing Pattern ###
  if(mixing_pattern_switch==1){
    #no mixing
  }else if(mixing_pattern_switch==2){
    #use constant
  }

  ### initial population ###
  mse_iniPopu = mongo.bson.value(mse_result, "iniPopu")

  age_1<-rep(0,length(mse_iniPopu))
  age_2<-rep(0,length(mse_iniPopu))
  stock_1_mean<-rep(0,length(mse_iniPopu))
  stock_2_mean<-rep(0,length(mse_iniPopu))

  for(i.db in 1:length(mse_iniPopu)){
    age_1[i.db]<-i.db-1
    stock_1_mean[i.db]<-mse_iniPopu[[i.db]]$stock_1_mean
    age_2[i.db]<-i.db-1
    stock_2_mean[i.db]<-mse_iniPopu[[i.db]]$stock_2_mean
  }

  cv_N_1<-mongo.bson.value(mse_result, "ip_cv_1")
  cv_N_2<-mongo.bson.value(mse_result, "ip_cv_2")

  
  ### biological parameters ###

  mse_bioParam = mongo.bson.value(mse_result, "bioParam")

  weight_at_age_1<-rep(0,length(mse_bioParam))
  fec_at_age_1<-rep(0,length(mse_bioParam))
  weight_at_age_2<-rep(0,length(mse_bioParam))
  fec_at_age_2<-rep(0,length(mse_bioParam))

  for(i.db in 1:length(mse_bioParam)){
    weight_at_age_1[i.db]<-mse_bioParam[[i.db]]$weight_at_age_1
    fec_at_age_1[i.db]<-mse_bioParam[[i.db]]$fec_at_age_1
    weight_at_age_2[i.db]<-mse_bioParam[[i.db]]$weight_at_age_2
    fec_at_age_2[i.db]<-mse_bioParam[[i.db]]$fec_at_age_2
  }

  ### natural mortality ###

  mse_mortality = mongo.bson.value(mse_result, "mortality")

  M_1<-rep(0,length(mse_mortality))
  M_2<-rep(0,length(mse_mortality))

  for(i.db in 1:length(mse_mortality)){
    M_1[i.db]<-mse_mortality[[i.db]]$mean_1
    M_2[i.db]<-mse_mortality[[i.db]]$mean_2
  }

  M_switch<-mongo.bson.value(mse_result, "nm_m") #h: high M, l: low M, and c: default current M
  if(M_switch=='h'){
    M_1<-M_1*1.5
    M_2<-M_2*1.5
  }else if(M_switch=='l'){
    M_1<-M_1*0.5
    M_2<-M_2*0.5
  }else if(M_switch=='c'){
    M_1<-M_1
    M_2<-M_2
  }

  cv_M_1<-mongo.bson.value(mse_result, "nm_cv_1")
  cv_M_2<-mongo.bson.value(mse_result, "nm_cv_2")


  ### recruitment ###
  season_factor<-mongo.bson.value(mse_result, "simple_spawning") #unit year
  sigma_R<-mongo.bson.value(mse_result, "cvForRecu")
  stock_1_rec_ratio<-mongo.bson.value(mse_result, "stock1_amount")/100.00
  stock_2_rec_ratio<-1-stock_1_rec_ratio
  Rratio_Ess_Num <-mongo.bson.value(mse_result, "observ_err_EW_stock")


  #the following are interactions, can be done with javascript
  #set switch for recruitment: switch_R_pattern 1: history  2: estimate from equation
  #set switch for recruitment: switch_R_year: 1: include years before 1984   2:exclude years before 1984
  switch_R_pattern<-mongo.bson.value(mse_result, "recruitTypeStock1")
  switch_R_year<-mongo.bson.value(mse_result, "fromHisStock1")
  print(switch_R_year)
  switch_R_formula<-mongo.bson.value(mse_result, "fromFmlStock1")
  switch_R_year_early<-mongo.bson.value(mse_result, "historySt1_early")
  switch_R_year_later<-mongo.bson.value(mse_result, "historySt1")
  
  if(switch_R_pattern==1){
   if(switch_R_year==1){
      if(switch_R_year_early==1){
        Rhist<-mongo.bson.value(mse_result, "hst1_mean_early")
      }else if(switch_R_year_early==2){
        Rhist<-mongo.bson.value(mse_result, "hst1_cal_early")
      }
    }else{
      if(switch_R_year_later==1){
        Rhist<-mongo.bson.value(mse_result, "hst1_mean")
      }else if(switch_R_year_later==2){
        Rhist<-mongo.bson.value(mse_result, "hst1_cal")
      }
    }
  }else if(switch_R_pattern==2){
    if(switch_R_formula==1){
      R0<-mongo.bson.value(mse_result, "fml1MbhmR0_early")
    }else if (switch_R_formula==2){
      R0<-mongo.bson.value(mse_result, "fml1MbhmR0")
    }
    steepness<-mongo.bson.value(mse_result, "fml1MbhmSteep")
    SSB0<-mongo.bson.value(mse_result, "fml1MbhmSSB0")
  }

  ### management option I ###

  SSB_MSY_BRP<-mongo.bson.value(mse_result, "bio_catch_mt")/1000   #unit 1000 eggs e+12
  F_MSY_BRP<-mongo.bson.value(mse_result, "bio_f_percent")

  HCR_pattern<-2 #HCR pattern 1: constant C, 2: constant F

  Harvest_level<-mongo.bson.value(mse_result, "harvest_level")

  imple_error<-mongo.bson.value(mse_result, "mg1_cv")

  
  


  ### management option II ###

  # Management option. They are also default values...
  Ratio_comm<-mongo.bson.value(mse_result, "sec_commercial")/100.00 # ratio between commercial and recreational fisheries
  Ratio_rec<-1-Ratio_comm

  Forhire_ratio<-mongo.bson.value(mse_result, "sec_hire")/100.00
  Private_ratio<-1-Forhire_ratio

  Ratio_private_east<-mongo.bson.value(mse_result, "p_e")/100.00 
  Ratio_private_west<-1-Ratio_private_east

  Ratio_forhire_east<-mongo.bson.value(mse_result, "sec_headboat")/100.00 
  Ratio_forhire_west<-1-Ratio_forhire_east

  ABC_pvalue<-mongo.bson.value(mse_result, "sec_pstar")/100.00

  Comme_buffer<-mongo.bson.value(mse_result, "sec_act_com")/100.00

  Private_buffer<-mongo.bson.value(mse_result, "sec_act_pri")/100.00

  Forhire_buffer<-mongo.bson.value(mse_result, "sec_act_hire")/100.00

  ### management option III ###
  #legal size
  Comme_min_size_in<-mongo.bson.value(mse_result, "mg3_commercial") # unit inch
  Recre_min_size_in<-mongo.bson.value(mse_result, "mg3_recreational")  #unit inch

  #bag limit
  Private_bag_limit<- mongo.bson.value(mse_result, "mg3_private") # unit Number per bag
  Forhire_bag_limit<- mongo.bson.value(mse_result, "mg3_forhire") # unit Number per bag

  

  #Management Options IV:
  #discard fractions unit % Shrimp E and Shrimp W are 1
  Recre_discard_E_open<-mongo.bson.value(mse_result, "mg3_rec_east_open")/100.00
  Recre_discard_E_closed<-mongo.bson.value(mse_result, "mg3_rec_east_closed")/100.00
  Recre_discard_W_open<-mongo.bson.value(mse_result, "mg3_rec_west_open")/100.00
  Recre_discard_W_closed<-mongo.bson.value(mse_result, "mg3_rec_west_closed")/100.00

  Comme_hl_discard_E_open<-mongo.bson.value(mse_result, "mg3_comhard_east_open")/100.00
  Comme_hl_discard_W_open<-mongo.bson.value(mse_result, "mg3_comhard_west_open")/100.00
  Comme_ll_discard_E_open<-mongo.bson.value(mse_result, "mg3_comlong_east_open")/100.00
  Comme_ll_discard_W_open<-mongo.bson.value(mse_result, "mg3_comlong_west_open")/100.00

  Comme_discard_E_closed<-mongo.bson.value(mse_result, "com_stock1_closed")/100.00
  Comme_discard_W_closed<-mongo.bson.value(mse_result, "com_stock2_closed")/100.00

  #the following MRIP and HBT discard are determined by Recre_discard_E_open & Recre_discard_W_open
  #Recre_MRIP_discard_E_open<-Recre_discard_E_open #fleet 5
  #Recre_MRIP_discard_W_open<-Recre_discard_W_open #fleet 6
  #Recre_HBT_discard_E_open<-Recre_discard_E_open #fleet 7
  #Recre_HBT_discard_W_open<-Recre_discard_W_open #fleet 8

  Recre_discard_E_open_CV<-0.05
  Recre_discard_E_closed_CV<-0.05
  Recre_discard_W_open_CV<-0.05
  Recre_discard_W_closed_CV<-0.05
  Comme_ll_discard_E_open_CV<-0.05
  Comme_ll_discard_W_open_CV<-0.05
  Comme_hl_discard_E_open_CV<-0.05
  Comme_hl_discard_W_open_CV<-0.05
  Comme_discard_E_closed_CV<-0.05
  Comme_discard_W_closed_CV<-0.05

  #the following MRIP and HBT discard are determined by Recre_discard_E_open & Recre_discard_W_open
  #Recre_MRIP_discard_E_open_CV<-Recre_discard_E_open_CV #fleet 5
  #Recre_MRIP_discard_W_open_CV<-Recre_discard_W_open_CV #fleet 6
  #Recre_HBT_discard_E_open_CV<-Recre_discard_E_open_CV #fleet 8
  #Recre_HBT_discard_W_open_CV<-Recre_discard_W_open_CV #fleet 8

  Comme_hl_discard_E_open_true<- rlnorm(1,log(Comme_hl_discard_E_open), Comme_hl_discard_E_open_CV)
  Comme_ll_discard_E_open_true<- rlnorm(1,log(Comme_ll_discard_E_open), Comme_ll_discard_E_open_CV)
  Comme_hl_discard_W_open_true<- rlnorm(1,log(Comme_hl_discard_W_open), Comme_hl_discard_W_open_CV)
  Comme_ll_discard_W_open_true<- rlnorm(1,log(Comme_ll_discard_W_open), Comme_ll_discard_W_open_CV)    

  Recre_discard_E_open_true<-rlnorm(1,log(Recre_discard_E_open), Recre_discard_E_open_CV)
  Recre_discard_W_open_true<-rlnorm(1,log(Recre_discard_W_open), Recre_discard_W_open_CV) 
    
  Recre_discard_E_closed_true<-rlnorm(1,log(Recre_discard_E_closed), Recre_discard_E_closed_CV)
  Recre_discard_W_closed_true<-rlnorm(1,log(Recre_discard_W_closed), Recre_discard_W_closed_CV)
  Comme_discard_E_closed_true<-rlnorm(1,log(Comme_discard_E_closed), Comme_discard_E_closed_CV)
  Comme_discard_W_closed_true<-rlnorm(1,log(Comme_discard_W_closed), Comme_discard_W_closed_CV)


  ### Management option V ###
  #Catch Rate
  Forhire_federal_catch_rate_lb<-mongo.bson.value(mse_result, "est_fed_forhire") #estimated considered the multiplier; unit lb per day
  Private_AL_catch_rate_lb<-mongo.bson.value(mse_result, "est_AL_private") #unit lb per day
  Private_FL_catch_rate_lb<-mongo.bson.value(mse_result, "est_FL_private") #unit lb per day
  Private_LA_catch_rate_lb<-mongo.bson.value(mse_result, "est_LA_private") #unit lb per day
  Private_MS_catch_rate_lb<-mongo.bson.value(mse_result, "est_MS_private") #unit lb per day
  Forhire_MS_catch_rate_lb<-mongo.bson.value(mse_result, "est_MS_forhire") #unit lb per day
  Private_TX_catch_rate_lb<-mongo.bson.value(mse_result, "est_TX_private") #unit lb per day
  Forhire_TX_catch_rate_lb<-mongo.bson.value(mse_result, "est_TX_forhire") #unit lb per day

  Forhire_season_switch<-mongo.bson.value(mse_result, "season_fed_forhire") 
  Private_season_switch<-mongo.bson.value(mse_result, "season_private")
  
  if(Forhire_season_switch==1) {
    #determined by ACT
  }  else if(Forhire_season_switch==2) {#input by user
    Forhire_season_length<-mongo.bson.value(mse_result, "fed_forhire_length")  #unit days
  }

  Forhire_MS_season_length_mean<-mongo.bson.value(mse_result, "MS_forhire_length")  #unit days
  Forhire_TX_season_length<-mongo.bson.value(mse_result, "TX_forhire_length")  #unit days

  if(Private_season_switch==1) {
    #determined by ACT
  }else if(Private_season_switch==2) {#input by user
    Private_AL_season_length<-mongo.bson.value(mse_result, "AL_private_length")  #unit days
    Private_FL_season_length<-mongo.bson.value(mse_result, "FL_private_length")  #unit days
    Private_LA_season_length<-mongo.bson.value(mse_result, "LA_private_length")  #unit days
    Private_MS_season_length<-mongo.bson.value(mse_result, "MS_private_length")  #unit days
    Private_TX_season_length<-mongo.bson.value(mse_result, "TX_private_length")  #unit days
  }

  #Mangement Option VI:
  Penalty_switch<-mongo.bson.value(mse_result, "penalty_switch")   #0 no action, 1 pentalty to the next year
  Carryover_switch<-mongo.bson.value(mse_result, "carryover_switch")  #0 no action, 1 carryover to the next year no over 95% of OFL, 2 to the next year no over 50% between ABC and OFL

  #Management Option VII:
  #Options for output calculation from data base also:
  Private_quota_AL<-mongo.bson.value(mse_result, "alabama")/100.0
  Private_quota_FL<-mongo.bson.value(mse_result, "florida") /100.0
  Private_quota_LA<-mongo.bson.value(mse_result, "louisiana") /100.0
  Private_quota_MS<-mongo.bson.value(mse_result, "mississippi") /100.0
  Private_quota_TX<-mongo.bson.value(mse_result, "texas") /100.0


  ### extra parameter from default setting but not shown in the user interface ###

    ##########################################################
    ###### Get Database User Interface Value End   ###########
    ##########################################################

    ##########################################################
    ###### Get Database Global setting Value Start ###########
    ##########################################################

    global_settings<-getGlobal()
    extra_param<-mongo.bson.value(global_settings, "extraParam")

    spawning_output_1<-unlist(extra_param$spawning_output_1)
    spawning_output_2<-unlist(extra_param$spawning_output_2)

    length_age_key<-extra_param$length_age_key
    length_age_key<-matrix(unlist(length_age_key), ncol = 21, byrow = TRUE)
    length_age_key_row_name<-unlist(extra_param$length_age_key_row_name)
    
    rownames(length_age_key)<-length_age_key_row_name
    colnames(length_age_key)<-0:plusage

    length_age_key_stock1<-length_age_key
    length_age_key_stock2<-length_age_key

    hl_e_pred_F_ave<-as.vector(extra_param$hl_e_pred_F_ave)
    hl_w_pred_F_ave<-as.vector(extra_param$hl_w_pred_F_ave)
    ll_e_pred_F_ave<-as.vector(extra_param$ll_e_pred_F_ave)
    ll_w_pred_F_ave<-as.vector(extra_param$ll_w_pred_F_ave)
    mrip_e_pred_F_ave<-as.vector(extra_param$mrip_e_pred_F_ave)
    mrip_w_pred_F_ave<-as.vector(extra_param$mrip_w_pred_F_ave)
    hbt_e_pred_F_ave<-as.vector(extra_param$hbt_e_pred_F_ave)
    hbt_w_pred_F_ave<-as.vector(extra_param$hbt_w_pred_F_ave)
    comm_closed_e_pred_F_ave<-as.vector(extra_param$comm_closed_e_pred_F_ave)
    comm_closed_w_pred_F_ave<-as.vector(extra_param$comm_closed_w_pred_F_ave)
    rec_closed_e_pred_F_ave<-as.vector(extra_param$rec_closed_e_pred_F_ave)
    rec_closed_w_pred_F_ave<-as.vector(extra_param$rec_closed_w_pred_F_ave)
    shrimp_e_pred_F_ave<-as.vector(extra_param$shrimp_e_pred_F_ave)
    shrimp_w_pred_F_ave<-as.vector(extra_param$shrimp_w_pred_F_ave)

    hl_e_selex<-unlist(extra_param$hl_e_selex)
    hl_w_selex<-unlist(extra_param$hl_w_selex)
    ll_e_selex<-unlist(extra_param$ll_e_selex)
    ll_w_selex<-unlist(extra_param$ll_w_selex)
    mrip_e_selex<-unlist(extra_param$mrip_e_selex)
    mrip_w_selex<-unlist(extra_param$mrip_w_selex)
    hbt_e_selex<-unlist(extra_param$hbt_e_selex)
    hbt_w_selex<-unlist(extra_param$hbt_w_selex)
    comm_closed_e_selex<-unlist(extra_param$comm_closed_e_selex)
    comm_closed_w_selex<-unlist(extra_param$comm_closed_w_selex)
    rec_closed_e_selex<-unlist(extra_param$rec_closed_e_selex)
    rec_closed_w_selex<-unlist(extra_param$rec_closed_w_selex)
    shrimp_e_selex<-unlist(extra_param$shrimp_e_selex)
    shrimp_w_selex<-unlist(extra_param$shrimp_w_selex)

    hl_e_retention_len<-unlist(extra_param$hl_e_retention_len)
    hl_w_retention_len<-unlist(extra_param$hl_w_retention_len)
    ll_e_retention_len<-unlist(extra_param$ll_e_retention_len)
    ll_w_retention_len<-unlist(extra_param$ll_w_retention_len)
    mrip_e_retention_len<-unlist(extra_param$mrip_e_retention_len)
    mrip_w_retention_len<-unlist(extra_param$mrip_w_retention_len)
    hbt_e_retention_len<-unlist(extra_param$hbt_e_retention_len)
    hbt_w_retention_len<-unlist(extra_param$hbt_w_retention_len)

    total_catch_N<-unlist(extra_param$total_catch_N)
    sum_N<-unlist(extra_param$sum_SSB_N)
    Current_F<-unlist(extra_param$Current_F)
    SSB_preyear_1<-unlist(extra_param$SSB_preyear_1)
    SSB_preyear_2<-unlist(extra_param$SSB_preyear_2)
    MSST<-extra_param$MSST
    MFMT<-extra_param$MFMT
    Current_F_ratio<-extra_param$Current_F_ratio
    Current_SSB_ratio<-extra_param$Current_SSB_ratio


    ##########################################################
    ###### Get Database Global setting Value End ###########
    ##########################################################






  #distribution of N distribution, only run once
  stock_1_dis_temp<-stock_1_mean/sum(stock_1_mean)
  stock_1_dis<-stock_1_dis_temp
  for(i.dist in 2:length(stock_1_mean)){
    stock_1_dis[i.dist]<-stock_1_dis[i.dist-1]+stock_1_dis_temp[i.dist]
  }

  stock_2_dis_temp<-stock_2_mean/sum(stock_2_mean)
  stock_2_dis<-stock_2_dis_temp
  for(i.dist in 2:length(stock_2_mean)){
    stock_2_dis[i.dist]<-stock_2_dis[i.dist-1]+stock_2_dis_temp[i.dist]
  }

  #some calculation before the ACL simulation
  #retention rate, it relates with the legal size, therefore, backcalculate the retention rate, ref min_size commerical 13 in (33.02 cm), recreational 16 in (40.64)
  #although can use getparameters<-SS_parlines(dir = direct, ctlfile = "control.ss_new", version = "3.30", verbose = TRUE, active = FALSE) to get the parameters, it will be too complicated
  ref_Comme_min_size_cm<-33.02 #unit cm
  ref_Recre_min_size_cm<-40.64 #unit cm
  Comme_min_size_cm<-Comme_min_size_in*2.54 # unit inch to cm
  Recre_min_size_cm<-Recre_min_size_in*2.54  #unit inch to cm

  thre_bin_comme<-as.numeric(rownames(length_age_key))[1]+2-2*which.max(as.numeric(rownames(length_age_key))<=Comme_min_size_cm)
  thre_bin_recre<-as.numeric(rownames(length_age_key))[1]+2-2*which.max(as.numeric(rownames(length_age_key))<=Recre_min_size_cm)

  #fix with transpose
  act_hl_e_retention_len<-hl_e_retention_len*(1+exp(-(as.numeric(rownames(length_age_key))-ref_Comme_min_size_cm)))/(1+exp(-(as.numeric(rownames(length_age_key))-Comme_min_size_cm)))
  act_hl_e_retention_len<-t(act_hl_e_retention_len)
  act_hl_e_retention<-c(as.matrix(act_hl_e_retention_len)%*%length_age_key_stock1[nrow(length_age_key_stock1):1,])
  
  act_hl_w_retention_len<-hl_w_retention_len*(1+exp(-(as.numeric(rownames(length_age_key))-ref_Comme_min_size_cm)))/(1+exp(-(as.numeric(rownames(length_age_key))-Comme_min_size_cm)))
  act_hl_w_retention_len<-t(act_hl_w_retention_len)
  act_hl_w_retention<-c(as.matrix(act_hl_w_retention_len)%*%length_age_key_stock2[nrow(length_age_key_stock2):1,])

  act_ll_e_retention_len<-ll_e_retention_len*(1+exp(-(as.numeric(rownames(length_age_key))-ref_Comme_min_size_cm)))/(1+exp(-(as.numeric(rownames(length_age_key))-Comme_min_size_cm)))
  act_ll_e_retention_len<-t(act_ll_e_retention_len)
  act_ll_e_retention<-c(as.matrix(act_ll_e_retention_len)%*%length_age_key_stock1[nrow(length_age_key_stock1):1,])
  
  act_ll_w_retention_len<-ll_w_retention_len*(1+exp(-(as.numeric(rownames(length_age_key))-ref_Comme_min_size_cm)))/(1+exp(-(as.numeric(rownames(length_age_key))-Comme_min_size_cm)))
  act_ll_w_retention_len<-t(act_ll_w_retention_len)
  act_ll_w_retention<-c(as.matrix(act_ll_w_retention_len)%*%length_age_key_stock2[nrow(length_age_key_stock2):1,])

  act_mrip_e_retention_len<-mrip_e_retention_len*(1+exp(-(as.numeric(rownames(length_age_key))-ref_Recre_min_size_cm)))/(1+exp(-(as.numeric(rownames(length_age_key))-Recre_min_size_cm)))
  act_mrip_e_retention_len<-t(act_mrip_e_retention_len)
  act_mrip_e_retention<-c(as.matrix(act_mrip_e_retention_len)%*%length_age_key_stock1[nrow(length_age_key_stock1):1,])
  
  act_mrip_w_retention_len<-mrip_w_retention_len*(1+exp(-(as.numeric(rownames(length_age_key))-ref_Recre_min_size_cm)))/(1+exp(-(as.numeric(rownames(length_age_key))-Recre_min_size_cm)))
  act_mrip_w_retention_len<-t(act_mrip_w_retention_len)
  act_mrip_w_retention<-c(as.matrix(act_mrip_w_retention_len)%*%length_age_key_stock2[nrow(length_age_key_stock2):1,])

  act_hbt_e_retention_len<-hbt_e_retention_len*(1+exp(-(as.numeric(rownames(length_age_key))-ref_Recre_min_size_cm)))/(1+exp(-(as.numeric(rownames(length_age_key))-Recre_min_size_cm)))
  act_hbt_e_retention_len<-t(act_hbt_e_retention_len)
  act_hbt_e_retention<-c(as.matrix(act_hbt_e_retention_len)%*%length_age_key_stock1[nrow(length_age_key_stock1):1,])
  
  act_hbt_w_retention_len<-hbt_w_retention_len*(1+exp(-(as.numeric(rownames(length_age_key))-ref_Recre_min_size_cm)))/(1+exp(-(as.numeric(rownames(length_age_key))-Recre_min_size_cm)))
  act_hbt_w_retention_len<-t(act_hbt_w_retention_len)
  act_hbt_w_retention<-c(as.matrix(act_hbt_w_retention_len)%*%length_age_key_stock2[nrow(length_age_key_stock2):1,])

  #estimate direct fishing F
  comp_comm_sel_e <- hl_e_pred_F_ave * hl_e_selex * act_hl_e_retention + ll_e_pred_F_ave * ll_e_selex * act_ll_e_retention 
  comp_comm_sel_w <- hl_w_pred_F_ave * hl_w_selex * act_hl_w_retention + ll_w_pred_F_ave * ll_w_selex * act_ll_w_retention

  comp_recr_sel_e <- mrip_e_pred_F_ave * mrip_e_selex * act_mrip_e_retention + hbt_e_pred_F_ave* hbt_e_selex * act_hbt_e_retention
  comp_recr_sel_w <- mrip_w_pred_F_ave * mrip_w_selex * act_mrip_w_retention + hbt_w_pred_F_ave* hbt_w_selex * act_hbt_w_retention

  #estimate open season discards for a directed fleet
  comp_comm_discard_e <- hl_e_pred_F_ave * hl_e_selex * (1-act_hl_e_retention) * Comme_hl_discard_E_open + ll_e_pred_F_ave * ll_e_selex * (1-act_ll_e_retention) * Comme_ll_discard_E_open
  comp_comm_discard_w <- hl_w_pred_F_ave * hl_w_selex * (1-act_hl_w_retention) * Comme_hl_discard_W_open + ll_w_pred_F_ave * ll_w_selex * (1-act_ll_w_retention) * Comme_ll_discard_W_open

  comp_recr_discard_e <- mrip_e_pred_F_ave * mrip_e_selex * (1-act_mrip_e_retention) * Recre_discard_E_open + hbt_e_pred_F_ave* hbt_e_selex * (1-act_hbt_e_retention) * Recre_discard_E_open
  comp_recr_discard_w <- mrip_w_pred_F_ave * mrip_w_selex * (1-act_mrip_w_retention) * Recre_discard_W_open + hbt_w_pred_F_ave* hbt_w_selex * (1-act_hbt_w_retention) * Recre_discard_W_open

  comp_bycatch_e <- rec_closed_e_pred_F_ave * rec_closed_e_selex * Recre_discard_E_closed + comm_closed_e_pred_F_ave * comm_closed_e_selex * Comme_discard_E_closed + shrimp_e_pred_F_ave * shrimp_e_selex
  comp_bycatch_w <- rec_closed_w_pred_F_ave * rec_closed_w_selex * Recre_discard_W_closed + comm_closed_w_pred_F_ave * comm_closed_w_selex * Comme_discard_W_closed + shrimp_w_pred_F_ave * shrimp_w_selex 

  comp_comm_discard_e_true <- hl_e_pred_F_ave * hl_e_selex * (1-act_hl_e_retention) * Comme_hl_discard_E_open_true + ll_e_pred_F_ave * ll_e_selex * (1-act_ll_e_retention) * Comme_ll_discard_E_open_true
  comp_comm_discard_w_true <- hl_w_pred_F_ave * hl_w_selex * (1-act_hl_w_retention) * Comme_hl_discard_W_open_true + ll_w_pred_F_ave * ll_w_selex * (1-act_ll_w_retention) * Comme_ll_discard_W_open_true
    
  comp_recr_discard_e_true <- mrip_e_pred_F_ave * mrip_e_selex * (1-act_mrip_e_retention) * Recre_discard_E_open_true + hbt_e_pred_F_ave* hbt_e_selex * (1-act_hbt_e_retention) * Recre_discard_E_open_true
  comp_recr_discard_w_true <- mrip_w_pred_F_ave * mrip_w_selex * (1-act_mrip_w_retention) * Recre_discard_W_open_true + hbt_w_pred_F_ave* hbt_w_selex * (1-act_hbt_w_retention) * Recre_discard_W_open_true
    
  comp_bycatch_e_true <- rec_closed_e_pred_F_ave * rec_closed_e_selex * Recre_discard_E_closed_true + comm_closed_e_pred_F_ave * comm_closed_e_selex * Comme_discard_E_closed_true + shrimp_e_pred_F_ave * shrimp_e_selex
  comp_bycatch_w_true <- rec_closed_w_pred_F_ave * rec_closed_w_selex * Recre_discard_W_closed_true + comm_closed_w_pred_F_ave * comm_closed_w_selex * Comme_discard_W_closed_true + shrimp_w_pred_F_ave * shrimp_w_selex

  #estimate F functions
  Function_relF<-function(F0) (true_quote-sum(true_N_1*(1-exp(-F0*(comp_comm_sel_e+comp_recr_sel_e + comp_comm_discard_e+comp_recr_discard_e) - comp_bycatch_e - M_1_true))*(F0*(comp_comm_sel_e+comp_recr_sel_e + comp_comm_discard_e+comp_recr_discard_e)+comp_bycatch_e)/(F0*(comp_comm_sel_e+comp_recr_sel_e + comp_comm_discard_e+comp_recr_discard_e) + comp_bycatch_e + M_1_true) +true_N_2*(1-exp(-F0*(comp_comm_sel_w+comp_recr_sel_w + comp_comm_discard_w+comp_recr_discard_w) - comp_bycatch_w - M_2_true))*(F0*(comp_comm_sel_w+comp_recr_sel_w + comp_comm_discard_w+comp_recr_discard_w) + comp_bycatch_w)/(F0*(comp_comm_sel_w+comp_recr_sel_w + comp_comm_discard_w+comp_recr_discard_w) + comp_bycatch_w + M_2_true)))^2

  Function_comm_imple<-function(F1)(Comme_planned_catch-sum(true_N_1*(1-exp(-F1*(comp_comm_sel_e+comp_recr_sel_e + comp_comm_discard_e_true +comp_recr_discard_e_true ) - comp_bycatch_e - M_1_true))*(F1*(comp_comm_sel_e))/(F1*(comp_comm_sel_e+comp_recr_sel_e + comp_comm_discard_e_true +comp_recr_discard_e_true ) + comp_bycatch_e + M_1_true) * weight_at_age_1 +true_N_2*(1-exp(-F1*(comp_comm_sel_w+comp_recr_sel_w + comp_comm_discard_w_true +comp_recr_discard_w_true ) - comp_bycatch_w - M_2_true))*(F1*(comp_comm_sel_w))/(F1*(comp_comm_sel_w+comp_recr_sel_w + comp_comm_discard_w_true +comp_recr_discard_w_true ) + comp_bycatch_w + M_2_true) * weight_at_age_2))^2

  Function_recr_imple<-function(F2)(Recre_planned_catch-sum(true_N_1*(1-exp(-F2*(comp_comm_sel_e+comp_recr_sel_e + comp_comm_discard_e_true +comp_recr_discard_e_true ) - comp_bycatch_e - M_1_true))*(F2*(comp_recr_sel_e))/(F2*(comp_comm_sel_e+comp_recr_sel_e + comp_comm_discard_e_true +comp_recr_discard_e_true ) + comp_bycatch_e + M_1_true) * weight_at_age_1 +true_N_2*(1-exp(-F2*(comp_comm_sel_w+comp_recr_sel_w + comp_comm_discard_w_true +comp_recr_discard_w_true ) - comp_bycatch_w - M_2_true))*(F2*(comp_recr_sel_w))/(F2*(comp_comm_sel_w+comp_recr_sel_w + comp_comm_discard_w_true +comp_recr_discard_w_true ) + comp_bycatch_w + M_2_true) * weight_at_age_2))^2

  ####Below is to project for a short term to determin ABC/ACL: assume the name of the parameters are the same. Run 100 times
  Catch_pred<-matrix(rep(0,Simrun_Num*Runtime_short), ncol=Runtime_short)
  #save.image("test1.RData")

  for (i.run in 1:Simrun_Num){
    
    #initial N Distribution
    if(seed_switch==2|seed_switch==3){#use seed
      set.seed(as.numeric(seed_input[i.run]))
      #print(as.numeric(seed_input[i.run]))
    }
    
    temp1<-runif(IniN_Ess_Num)
    #print("temp1")
    #print(temp1)
    temp2<-runif(IniN_Ess_Num)
    #print("temp2")
    #print(temp2)    
    count_1<-rep(0,length(stock_1_mean))
    for (i.ess in 1:IniN_Ess_Num){
      j<-which.min(temp1[i.ess]>stock_1_dis)
      count_1[j]<-count_1[j]+1
    }
    true_N_1_dis<-count_1/sum(count_1)
    
    count_2<-rep(0,length(stock_2_mean))
    for (i.ess in 1:IniN_Ess_Num){
      j<-which.min(temp2[i.ess]>stock_2_dis)
      count_2[j]<-count_2[j]+1
    }
    true_N_2_dis<-count_2/sum(count_2)
    
    #initial N unit 1000s
    true_N_1_total<-rlnorm(1,log(sum(stock_1_mean)),cv_N_1)
    while ((true_N_1_total>sum(stock_1_mean)*2)|(true_N_1_total<sum(stock_1_mean)/2)){
      true_N_1_total<-rlnorm(1,log(sum(stock_1_mean)),cv_N_1)
    }
    
    true_N_2_total<-rlnorm(1,log(sum(stock_2_mean)),cv_N_2)
    while ((true_N_2_total>sum(stock_2_mean)*2)|(true_N_2_total<sum(stock_2_mean)/2)){
      true_N_2_total<-rlnorm(1,log(sum(stock_2_mean)),cv_N_2)
    }
    
    true_N_1<-true_N_1_total*true_N_1_dis
    true_N_2<-true_N_2_total*true_N_2_dis
    
    for (i.runtime in 1:Runtime_short){
      ##estimate recruitment
      #estimate SSB in the next year
      true_SSB_1<-true_N_1 * fec_at_age_1
      true_SSB_2<-true_N_2 * fec_at_age_2
      
      if(switch_R_pattern==1){
        tempR_mean<-Rhist
      }else if (switch_R_pattern==2){
        tempR_mean<-4*steepness*R0*sum(true_SSB_1+true_SSB_2)/((1-steepness)*SSB0+(5*steepness-1)*sum(true_SSB_1+true_SSB_2))
      }#R unit 1000s SSB unit 1000 eggs
      
      tempR<-rlnorm(1,log(tempR_mean),sigma_R)
      while ((tempR>tempR_mean*2)|(tempR<tempR_mean/2)){
        tempR<-rlnorm(1,log(tempR_mean),sigma_R)
      }
      
      count_3<-0
      temp3<-runif(Rratio_Ess_Num)
      #print("temp3")
      #print(temp3)
      for (i.ess2 in 1:Rratio_Ess_Num){
        if(temp3[i.ess2]<stock_1_rec_ratio)
          count_3<-count_3+1
      }
      true_stock_1_rec_ratio<-count_3/Rratio_Ess_Num
      
      pred_R_1<-tempR*true_stock_1_rec_ratio
      pred_R_2<-tempR*(1-true_stock_1_rec_ratio)
      
      B_at_age_1<-true_N_1*weight_at_age_1 #biomass unit 1000*kg=mt
      B_at_age_2<-true_N_2*weight_at_age_2 #biomass unit 1000*kg=mt
      
      #Catch quote unit number which includes bycatch and discards
      Quote_total<-(sum(true_N_1)+sum(true_N_2))*Harvest_level
      true_quote<-rlnorm(1,log(Quote_total),imple_error)
      while ((true_quote>Quote_total*2)|(true_quote<Quote_total/2)){
        true_quote<-rlnorm(1,log(Quote_total),imple_error)
      }
      
      #estimate M
      M_1_relative<-rlnorm(1,0,cv_M_1)
      while ((M_1_relative>2)|(M_1_relative<1/2)){
        M_1_relative<-rlnorm(1,0,cv_M_1)
      }
      
      M_2_relative<-rlnorm(1,0,cv_M_2)
      while ((M_2_relative>2)|(M_2_relative<1/2)){
        M_2_relative<-rlnorm(1,0,cv_M_2)
      }
      M_1_true<-M_1_relative*M_1
      M_2_true<-M_2_relative*M_2
      
      relF<-max(optimize(Function_relF,c(0,10))$minimum,0)
      #optim(0,Function_relF,method="Nelder-Mead",hessian=TRUE)$par
   
      total_F_1<-relF * comp_recr_sel_e + relF * comp_comm_sel_e + relF * comp_recr_discard_e_true + relF * comp_comm_discard_e_true + rec_closed_e_pred_F_ave * rec_closed_e_selex * Recre_discard_E_closed_true + comm_closed_e_pred_F_ave * comm_closed_e_selex * Comme_discard_E_closed_true + shrimp_e_pred_F_ave * shrimp_e_selex #retention 0 discard 1 for shirmp
      
      total_F_2<-relF * comp_recr_sel_w + relF * comp_comm_sel_w + relF * comp_recr_discard_w_true + relF * comp_comm_discard_w_true + rec_closed_w_pred_F_ave * rec_closed_w_selex * Recre_discard_W_closed_true + comm_closed_w_pred_F_ave * comm_closed_w_selex * Comme_discard_W_closed_true + shrimp_w_pred_F_ave * shrimp_w_selex 
    
      mod_F_1<-relF * comp_recr_sel_e + relF * comp_comm_sel_e
      
      mod_F_2<-relF * comp_recr_sel_w + relF * comp_comm_sel_w
      
      true_N_1_nextyeartemp<-true_N_1*exp(-total_F_1 -M_1_true)
      true_N_2_nextyeartemp<-true_N_2*exp(-total_F_2 -M_2_true)
      
      catch_N_1_pred<-(true_N_1-true_N_1_nextyeartemp)*mod_F_1/(total_F_1 + M_1_true)
      catch_N_2_pred<-(true_N_2-true_N_2_nextyeartemp)*mod_F_2/(total_F_2 + M_2_true)
      
      total_catch_B_pred<-sum(catch_N_1_pred * weight_at_age_1 +catch_N_2_pred * weight_at_age_2) #unit mt
      Catch_pred[i.run,i.runtime]<-total_catch_B_pred
      
      true_N_1[2:(length(true_N_1)-1)]<-true_N_1_nextyeartemp[1:(length(true_N_1)-2)]
      true_N_2[2:(length(true_N_2)-1)]<-true_N_2_nextyeartemp[1:(length(true_N_2)-2)]
      true_N_1[length(true_N_1)]<-true_N_1_nextyeartemp[length(true_N_1)-1]+true_N_1_nextyeartemp[length(true_N_1)]
      true_N_2[length(true_N_2)]<-true_N_2_nextyeartemp[length(true_N_2)-1]+true_N_2_nextyeartemp[length(true_N_2)]
      
      true_N_1[1]<-pred_R_1
      true_N_2[1]<-pred_R_2
    }
  }


  ABC_planned<-as.numeric(quantile(rowMeans(Catch_pred[,91:100]),ABC_pvalue)) #unit 1000*kg=mt
  OFL_planned<-as.numeric(quantile(rowMeans(Catch_pred[,91:100]),0.5)) 

  #ABC_planned<-as.numeric(quantile(rowMeans(Catch_pred),ABC_pvalue)) #unit 1000*kg=mt
  #OFL_planned<-as.numeric(quantile(rowMeans(Catch_pred),0.5)) 
  #save.image("MSEspace2.RData")

  #true accountability measures
  R_1<-matrix(rep(0,Simrun_Num*(Runtime_long+1)), ncol=(Runtime_long+1))
  R_2<-matrix(rep(0,Simrun_Num*(Runtime_long+1)), ncol=(Runtime_long+1))
  SSB_1<-matrix(rep(0,Simrun_Num*(Runtime_long+1)), ncol=(Runtime_long+1))
  SSB_2<-matrix(rep(0,Simrun_Num*(Runtime_long+1)), ncol=(Runtime_long+1))
  total_SSB<-matrix(rep(0,Simrun_Num*Runtime_long), ncol=Runtime_long)
  totalcatch_1_imple<-matrix(rep(0,Simrun_Num*Runtime_long), ncol=Runtime_long)
  totalcatch_2_imple<-matrix(rep(0,Simrun_Num*Runtime_long), ncol=Runtime_long)
  total_catch<-matrix(rep(0,Simrun_Num*Runtime_long), ncol=Runtime_long)
  comm_catch<-matrix(rep(0,Simrun_Num*Runtime_long), ncol=Runtime_long)
  comm_catch_1<-matrix(rep(0,Simrun_Num*Runtime_long), ncol=Runtime_long)
  comm_catch_2<-matrix(rep(0,Simrun_Num*Runtime_long), ncol=Runtime_long)
  recr_catch<-matrix(rep(0,Simrun_Num*Runtime_long), ncol=Runtime_long)
  Forhire_catch<-matrix(rep(0,Simrun_Num*Runtime_long), ncol=Runtime_long)
  Forhire_catch_1<-matrix(rep(0,Simrun_Num*Runtime_long), ncol=Runtime_long)
  Forhire_catch_2<-matrix(rep(0,Simrun_Num*Runtime_long), ncol=Runtime_long)
  Private_catch<-matrix(rep(0,Simrun_Num*Runtime_long), ncol=Runtime_long)
  Private_catch_1<-matrix(rep(0,Simrun_Num*Runtime_long), ncol=Runtime_long)
  Private_catch_2<-matrix(rep(0,Simrun_Num*Runtime_long), ncol=Runtime_long)
  comm_discards<-matrix(rep(0,Simrun_Num*Runtime_long), ncol=Runtime_long)  
  recr_discards<-matrix(rep(0,Simrun_Num*Runtime_long), ncol=Runtime_long)
  comm_disalloratio<-matrix(rep(0,Simrun_Num*Runtime_long), ncol=Runtime_long)
  recr_disalloratio<-matrix(rep(0,Simrun_Num*Runtime_long), ncol=Runtime_long)
  true_fed_forhire_season_length<-matrix(rep(0,Simrun_Num*Runtime_long), ncol=Runtime_long)
  true_private_AL_season_length<-matrix(rep(0,Simrun_Num*Runtime_long), ncol=Runtime_long)
  true_private_FL_season_length<-matrix(rep(0,Simrun_Num*Runtime_long), ncol=Runtime_long)
  true_private_LA_season_length<-matrix(rep(0,Simrun_Num*Runtime_long), ncol=Runtime_long)
  true_private_MS_season_length<-matrix(rep(0,Simrun_Num*Runtime_long), ncol=Runtime_long)
  #true_forhire_MS_season_length<-matrix(rep(0,Simrun_Num*Runtime_long), ncol=Runtime_long)
  true_private_TX_season_length<-matrix(rep(0,Simrun_Num*Runtime_long), ncol=Runtime_long)
  #true_forhire_TX_season_length<-matrix(rep(0,Simrun_Num*Runtime_long), ncol=Runtime_long)
  true_private_AL_catch<-matrix(rep(0,Simrun_Num*Runtime_long), ncol=Runtime_long)
  true_private_FL_catch<-matrix(rep(0,Simrun_Num*Runtime_long), ncol=Runtime_long)
  true_private_LA_catch<-matrix(rep(0,Simrun_Num*Runtime_long), ncol=Runtime_long)
  true_private_MS_catch<-matrix(rep(0,Simrun_Num*Runtime_long), ncol=Runtime_long)
  #true_forhire_MS_catch<-matrix(rep(0,Simrun_Num*Runtime_long), ncol=Runtime_long)
  true_private_TX_catch<-matrix(rep(0,Simrun_Num*Runtime_long), ncol=Runtime_long)
  #true_forhire_TX_catch<-matrix(rep(0,Simrun_Num*Runtime_long), ncol=Runtime_long)
  F_general<-matrix(rep(0,Simrun_Num*Runtime_long), ncol=Runtime_long)
  #AM_comm_overunderage<-matrix(rep(0,Simrun_Num*Runtime_long), ncol=Runtime_long)
  AM_forhire_overunderage<-matrix(rep(0,Simrun_Num*(Runtime_long+1)), ncol=(Runtime_long+1))
  AM_AL_overunderage<-matrix(rep(0,Simrun_Num*(Runtime_long+1)), ncol=(Runtime_long+1))
  AM_FL_overunderage<-matrix(rep(0,Simrun_Num*(Runtime_long+1)), ncol=(Runtime_long+1))
  AM_LA_overunderage<-matrix(rep(0,Simrun_Num*(Runtime_long+1)), ncol=(Runtime_long+1))
  AM_MS_overunderage<-matrix(rep(0,Simrun_Num*(Runtime_long+1)), ncol=(Runtime_long+1))
  AM_TX_overunderage<-matrix(rep(0,Simrun_Num*(Runtime_long+1)), ncol=(Runtime_long+1))
  #AM_forhire_flag<-matrix(rep(0,Simrun_Num*(Runtime_long+1)), ncol=(Runtime_long+1)) #default 0, 1 overage -1 underage
  #AM_AL_flag<-matrix(rep(0,Simrun_Num*(Runtime_long+1)), ncol=(Runtime_long+1)) #default 0, 1 overage -1 underage
  #AM_FL_flag<-matrix(rep(0,Simrun_Num*(Runtime_long+1)), ncol=(Runtime_long+1)) #default 0, 1 overage -1 underage
  #AM_LA_flag<-matrix(rep(0,Simrun_Num*(Runtime_long+1)), ncol=(Runtime_long+1)) #default 0, 1 overage -1 underage
  #AM_MS_flag<-matrix(rep(0,Simrun_Num*(Runtime_long+1)), ncol=(Runtime_long+1)) #default 0, 1 overage -1 underage
  #AM_TX_flag<-matrix(rep(0,Simrun_Num*(Runtime_long+1)), ncol=(Runtime_long+1)) #default 0, 1 overage -1 underage
  Year_green<-matrix(rep(0,Simrun_Num*Runtime_long), ncol=Runtime_long)
  F_ratio<-matrix(rep(0,Simrun_Num*Runtime_long), ncol=Runtime_long)
  SSB_ratio<-matrix(rep(0,Simrun_Num*Runtime_long), ncol=Runtime_long)

  imple_error2<-0.05 #CV for catch rate

  for (i.run in 1:Simrun_Num){
    if(seed_switch==2|seed_switch==3){#use seed
      set.seed(as.numeric(seed_input[100+i.run]))
      #print(as.numeric(seed_input[100+i.run]))
    }
    cat('\n run number: ', i.run)
    cat('\n seed 100+i.run: ',set.seed(as.numeric(seed_input[100+i.run])))
    #initial N Distribution
    temp1<-runif(IniN_Ess_Num)
    #print("temp1")
    #print(temp1)
    temp2<-runif(IniN_Ess_Num)
    #print("temp2")
    #print(temp2)
    count_1_imple<-rep(0,length(stock_1_mean))
    for (i.ess in 1:IniN_Ess_Num){
      j<-which.min(temp1[i.ess]>stock_1_dis)
      count_1_imple[j]<-count_1_imple[j]+1
    }
    true_N_1_dis<-count_1_imple/sum(count_1_imple)
    
    count_2_imple<-rep(0,length(stock_2_mean))
    for (i.ess in 1:IniN_Ess_Num){
      j<-which.min(temp2[i.ess]>stock_2_dis)
      count_2_imple[j]<-count_2_imple[j]+1
    }
    true_N_2_dis<-count_2_imple/sum(count_2_imple)
    
    #initial N unit 1000s
    true_N_1_total<-rlnorm(1,log(sum(stock_1_mean)),cv_N_1)
    while ((true_N_1_total>sum(stock_1_mean)*2)|(true_N_1_total<sum(stock_1_mean)/2)){
      true_N_1_total<-rlnorm(1,log(sum(stock_1_mean)),cv_N_1)
    }
    
    true_N_2_total<-rlnorm(1,log(sum(stock_2_mean)),cv_N_2)
    while ((true_N_2_total>sum(stock_2_mean)*2)|(true_N_2_total<sum(stock_2_mean)/2)){
      true_N_2_total<-rlnorm(1,log(sum(stock_2_mean)),cv_N_2)
    }
    
    true_N_1<-true_N_1_total*true_N_1_dis
    true_N_2<-true_N_2_total*true_N_2_dis
    
    R_1[i.run,1]<-true_N_1[1] # unit 1000s
    R_2[i.run,1]<-true_N_2[1] # unit 1000s
    
    SSB_1[i.run,1]<-sum(SSB_preyear_1) # unit 1000 eggs
    SSB_2[i.run,1]<-sum(SSB_preyear_2) # unit 1000 eggs
    
    overunderage<-0
    
    for (i.runtime in 1:Runtime_long){
      ##estimate recruitment
      #estimate SSB for the next year
      true_SSB_1<-true_N_1 * fec_at_age_1
      true_SSB_2<-true_N_2 * fec_at_age_2
      
      SSB_1[i.run,i.runtime+1]<-sum(true_SSB_1)
      SSB_2[i.run,i.runtime+1]<-sum(true_SSB_2)
      
      if(switch_R_pattern==1){
        tempR_mean<-Rhist
      }else if(switch_R_pattern==2){
        tempR_mean<-4*steepness*R0*sum(true_SSB_1+true_SSB_2)/((1-steepness)*SSB0+(5*steepness-1)*sum(true_SSB_1+true_SSB_2))
      } #R unit 1000s, SSB unit 1000 eggs
      
      tempR<-rlnorm(1,log(tempR_mean),sigma_R)
      while ((tempR>tempR_mean*2)|(tempR<tempR_mean/2)){
        tempR<-rlnorm(1,log(tempR_mean),sigma_R)
      }
      
      count_3_imple<-0
      temp3<-runif(Rratio_Ess_Num)
      for (i.ess2 in 1:Rratio_Ess_Num){
        if(temp3[i.ess2]<stock_1_rec_ratio)
          count_3_imple<-count_3_imple+1
      }
      true_stock_1_rec_ratio<-count_3_imple/Rratio_Ess_Num
      
      true_R_1<-tempR*stock_1_rec_ratio
      true_R_2<-tempR*(1-stock_1_rec_ratio)
      
      R_1[i.run, i.runtime+1]<-true_R_1
      R_2[i.run, i.runtime+1]<-true_R_2
      
      B_at_age_1<-true_N_1*weight_at_age_1 #biomass unit 1000*kg=mt
      B_at_age_2<-true_N_2*weight_at_age_2 #biomass unit 1000*kg=mt
      
      if(overunderage>=0){
        if(Carryover_switch==1){
          ACL_planned<-max(min((ABC_planned+overunderage),OFL_planned*0.95),0)
        }else if(Carryover_switch==2){
          ACL_planned<-max(min((ABC_planned+overunderage),(OFL_planned+ABC_planned)/2),0)
        }else if(Carryover_switch==0){
          ACL_planned<-max(ABC_planned,0)
        }
      }else if(overunderage<0){
        if(Penalty_switch==1){
          ACL_planned<-max(min((ABC_planned+overunderage),OFL_planned*0.95),0)
        }else if(Penalty_switch==0){
          ACL_planned<-max(ABC_planned,0)
        }
      }
      
      sum_overunderage_lastyear<-AM_forhire_overunderage[i.run,i.runtime]+AM_AL_overunderage[i.run,i.runtime]+AM_FL_overunderage[i.run,i.runtime]+AM_LA_overunderage[i.run,i.runtime]+AM_MS_overunderage[i.run,i.runtime]+AM_TX_overunderage[i.run,i.runtime]
      abssum_overunderage_lastyear<-abs(AM_forhire_overunderage[i.run,i.runtime])+abs(AM_AL_overunderage[i.run,i.runtime])+abs(AM_FL_overunderage[i.run,i.runtime])+abs(AM_LA_overunderage[i.run,i.runtime])+abs(AM_MS_overunderage[i.run,i.runtime])+abs(AM_TX_overunderage[i.run,i.runtime])

      if((sum_overunderage_lastyear!=0)|(abssum_overunderage_lastyear>0)){
        if(sum_overunderage_lastyear>=0){
          forhire_overunderage_lastyear<-(ACL_planned-ABC_planned)/(sum_overunderage_lastyear+0.000001)*AM_forhire_overunderage[i.run,i.runtime]
          AL_overunderage_lastyear<-(ACL_planned-ABC_planned)/(sum_overunderage_lastyear+0.000001)*AM_AL_overunderage[i.run,i.runtime]
          FL_overunderage_lastyear<-(ACL_planned-ABC_planned)/(sum_overunderage_lastyear+0.000001)*AM_FL_overunderage[i.run,i.runtime]
          LA_overunderage_lastyear<-(ACL_planned-ABC_planned)/(sum_overunderage_lastyear+0.000001)*AM_LA_overunderage[i.run,i.runtime]
          MS_overunderage_lastyear<-(ACL_planned-ABC_planned)/(sum_overunderage_lastyear+0.000001)*AM_MS_overunderage[i.run,i.runtime]
          TX_overunderage_lastyear<-(ACL_planned-ABC_planned)/(sum_overunderage_lastyear+0.000001)*AM_TX_overunderage[i.run,i.runtime]
        }else{
          forhire_overunderage_lastyear<-(ACL_planned-ABC_planned)/(sum_overunderage_lastyear-0.000001)*AM_forhire_overunderage[i.run,i.runtime]
          AL_overunderage_lastyear<-(ACL_planned-ABC_planned)/(sum_overunderage_lastyear-0.000001)*AM_AL_overunderage[i.run,i.runtime]
          FL_overunderage_lastyear<-(ACL_planned-ABC_planned)/(sum_overunderage_lastyear-0.000001)*AM_FL_overunderage[i.run,i.runtime]
          LA_overunderage_lastyear<-(ACL_planned-ABC_planned)/(sum_overunderage_lastyear-0.000001)*AM_LA_overunderage[i.run,i.runtime]
          MS_overunderage_lastyear<-(ACL_planned-ABC_planned)/(sum_overunderage_lastyear-0.000001)*AM_MS_overunderage[i.run,i.runtime]
          TX_overunderage_lastyear<-(ACL_planned-ABC_planned)/(sum_overunderage_lastyear-0.000001)*AM_TX_overunderage[i.run,i.runtime]
        }
        
      }else{
        forhire_overunderage_lastyear<-0
        AL_overunderage_lastyear<-0
        FL_overunderage_lastyear<-0
        LA_overunderage_lastyear<-0
        MS_overunderage_lastyear<-0
        TX_overunderage_lastyear<-0
      }
    
      Quote_comm_befbuf<-ABC_planned * Ratio_comm #unit 1000*kg=mt
      Quote_rec_befbuf<-ABC_planned * Ratio_rec #unit 1000*kg=mt
      
      Quote_forhire_befbuf<-Quote_rec_befbuf * Forhire_ratio #unit 1000*kg=mt
      Quote_private_befbuf<-Quote_rec_befbuf * Private_ratio #unit 1000*kg=mt
      
      Quote_comm_aftbuf<-Quote_comm_befbuf*(1-Comme_buffer)
      Quote_forhire_aftbuf<-Quote_forhire_befbuf*(1-Forhire_buffer)
      Quote_private_aftbuf<-Quote_private_befbuf*(1-Private_buffer)
      
      #commercial catch quota determined by ACT # set a lower implementation error for commercial catch
      Plan_quote_comm<-rlnorm(1,log(Quote_comm_aftbuf),imple_error2)
      cat('\n Plan_quote_comm before while: ', Plan_quote_comm)
      while((Plan_quote_comm>Quote_comm_aftbuf*2)|(Plan_quote_comm<Quote_comm_aftbuf/2)){
        Plan_quote_comm<-rlnorm(1,log(Quote_comm_aftbuf),imple_error2)
      }
      cat('\n Plan_quote_comm after while: ', Plan_quote_comm)

      Forhire_federal_catch_rate_kg<-Forhire_federal_catch_rate_lb*0.453592 #unit kg per day
      cat('\n Forhire_federal_catch_rate_kg: ', Forhire_federal_catch_rate_kg)
      Plan_Forhire_federal_catch_rate_kg<-rlnorm(1,log(Forhire_federal_catch_rate_kg),imple_error2)
      cat('\n Plan_Forhire_federal_catch_rate_kg before while: ', Plan_Forhire_federal_catch_rate_kg)
      while((Plan_Forhire_federal_catch_rate_kg>Forhire_federal_catch_rate_kg*2)|(Plan_Forhire_federal_catch_rate_kg<Forhire_federal_catch_rate_kg/2)){
        Plan_Forhire_federal_catch_rate_kg<-rlnorm(1,log(Forhire_federal_catch_rate_kg),imple_error2)
      }
      cat('\n Plan_Forhire_federal_catch_rate_kg after while: ', Plan_Forhire_federal_catch_rate_kg)
      cat('\n Forhire_season_switch: ', Forhire_season_switch)
      if(Forhire_season_switch==1) {
        #determined by ACT
        cat('\n imple_error: ',imple_error)
        Plan_quote_forhire<-rlnorm(1,log(Quote_forhire_aftbuf),imple_error)
        while((Plan_quote_forhire>Quote_forhire_aftbuf*2)|(Plan_quote_forhire<Quote_forhire_aftbuf/2)){
          Plan_quote_forhire<-rlnorm(1,log(Quote_forhire_aftbuf),imple_error)
        }
      }else if(Forhire_season_switch==2) {#input by user
        Plan_quote_forhire<-Forhire_season_length*Plan_Forhire_federal_catch_rate_kg/1000 #unit 1000 kg
      }
      Plan_quote_forhire<-Plan_quote_forhire+forhire_overunderage_lastyear
      cat('\n Plan_quote_forhire: ', Plan_quote_forhire)
      cat('\n forhire_overunderage_lastyear: ',forhire_overunderage_lastyear)
      Private_AL_catch_rate_kg<-Private_AL_catch_rate_lb*0.453592
      Private_FL_catch_rate_kg<-Private_FL_catch_rate_lb*0.453592
      Private_LA_catch_rate_kg<-Private_LA_catch_rate_lb*0.453592
      Private_MS_catch_rate_kg<-Private_MS_catch_rate_lb*0.453592
      Forhire_MS_catch_rate_kg<-Forhire_MS_catch_rate_lb*0.453592
      Private_TX_catch_rate_kg<-Private_TX_catch_rate_lb*0.453592
      Forhire_TX_catch_rate_kg<-Forhire_TX_catch_rate_lb*0.453592

      cat('\n Private_AL_catch_rate_kg: ',Private_AL_catch_rate_kg)
      cat('\n Private_FL_catch_rate_kg: ',Private_FL_catch_rate_kg)
      cat('\n Private_LA_catch_rate_kg: ',Private_LA_catch_rate_kg)
      cat('\n Private_MS_catch_rate_kg: ',Private_MS_catch_rate_kg)
      cat('\n Private_TX_catch_rate_kg: ',Private_TX_catch_rate_kg)
      cat('\n Forhire_MS_catch_rate_kg: ',Forhire_MS_catch_rate_kg)
      cat('\n Forhire_TX_catch_rate_kg: ',Forhire_TX_catch_rate_kg)
      
      #For the states with both state-forhire and private angling (MS and TX), we set the state for-hire season as MS about 20 days (with 5% CV), TX 365 days.
      #The catch rate are all assumed as 5% CV.
      #reference: MS: state forhire VS private angling 17* 176 (2992) VS 81* 1823 (147663). TX: state forhire VS private angling 365*225 (82125) VS 62 * 2880 (178560)
      cat('\n imple_error2: ',imple_error2)
      
      Forhire_MS_season_length_temp<-rlnorm(1,log(Forhire_MS_season_length_mean),imple_error2)
      cat('\n Forhire_MS_season_length_temp before while: ', Forhire_MS_season_length_temp)
      while((Forhire_MS_season_length_temp>Forhire_MS_season_length_mean*2)|(Forhire_MS_season_length_temp<Forhire_MS_season_length_mean/2)){
        Forhire_MS_season_length_temp<-rlnorm(1,log(Forhire_MS_season_length_mean),imple_error2)
      }
      Forhire_MS_season_length<-round(Forhire_MS_season_length_temp)
      cat('\n Forhire_MS_season_length_temp after while: ', Forhire_MS_season_length_temp)

      Plan_Private_AL_catch_rate_kg<-rlnorm(1,log(Private_AL_catch_rate_kg),imple_error2)
      cat('\n Plan_Private_AL_catch_rate_kg before while: ', Plan_Private_AL_catch_rate_kg)
      while((Plan_Private_AL_catch_rate_kg>Private_AL_catch_rate_kg*2)|(Plan_Private_AL_catch_rate_kg<Private_AL_catch_rate_kg/2)){
        Plan_Private_AL_catch_rate_kg<-rlnorm(1,log(Private_AL_catch_rate_kg),imple_error2)
      }
      cat('\n Plan_Private_AL_catch_rate_kg after while: ', Plan_Private_AL_catch_rate_kg)
      
      Plan_Private_FL_catch_rate_kg<-rlnorm(1,log(Private_FL_catch_rate_kg),imple_error2)
      cat('\n Plan_Private_FL_catch_rate_kg before while: ', Plan_Private_FL_catch_rate_kg)
      while((Plan_Private_FL_catch_rate_kg>Private_FL_catch_rate_kg*2)|(Plan_Private_FL_catch_rate_kg<Private_FL_catch_rate_kg/2)){
        Plan_Private_FL_catch_rate_kg<-rlnorm(1,log(Private_FL_catch_rate_kg),imple_error2)
      }
      cat('\n Plan_Private_FL_catch_rate_kg after while: ', Plan_Private_FL_catch_rate_kg)

      Plan_Private_LA_catch_rate_kg<-rlnorm(1,log(Private_LA_catch_rate_kg),imple_error2)
      cat('\n Plan_Private_LA_catch_rate_kg before while: ', Plan_Private_LA_catch_rate_kg)
      while((Plan_Private_LA_catch_rate_kg>Private_LA_catch_rate_kg*2)|(Plan_Private_LA_catch_rate_kg<Private_LA_catch_rate_kg/2)){
        Plan_Private_LA_catch_rate_kg<-rlnorm(1,log(Private_LA_catch_rate_kg),imple_error2)
      }
      cat('\n Plan_Private_LA_catch_rate_kg after while: ', Plan_Private_LA_catch_rate_kg)
      
      Plan_Private_MS_catch_rate_kg<-rlnorm(1,log(Private_MS_catch_rate_kg),imple_error2)
      cat('\n Plan_Private_MS_catch_rate_kg before while: ', Plan_Private_MS_catch_rate_kg)
      while((Plan_Private_MS_catch_rate_kg>Private_MS_catch_rate_kg*2)|(Plan_Private_MS_catch_rate_kg<Private_MS_catch_rate_kg/2)){
        Plan_Private_MS_catch_rate_kg<-rlnorm(1,log(Private_MS_catch_rate_kg),imple_error2)
      }
      cat('\n Plan_Private_MS_catch_rate_kg after while: ', Plan_Private_MS_catch_rate_kg)
      
      Plan_Private_TX_catch_rate_kg<-rlnorm(1,log(Private_TX_catch_rate_kg),imple_error2)
      cat('\n Plan_Private_TX_catch_rate_kg before while: ', Plan_Private_TX_catch_rate_kg)
      while((Plan_Private_TX_catch_rate_kg>Private_TX_catch_rate_kg*2)|(Plan_Private_TX_catch_rate_kg<Private_TX_catch_rate_kg/2)){
        Plan_Private_TX_catch_rate_kg<-rlnorm(1,log(Private_TX_catch_rate_kg),imple_error2)
      }
      cat('\n Plan_Private_TX_catch_rate_kg after while: ', Plan_Private_TX_catch_rate_kg)

      Plan_Forhire_MS_catch_rate_kg<-rlnorm(1,log(Forhire_MS_catch_rate_kg),imple_error2)
      cat('\n Plan_Forhire_MS_catch_rate_kg before while: ', Plan_Forhire_MS_catch_rate_kg)
      while((Plan_Forhire_MS_catch_rate_kg>Forhire_MS_catch_rate_kg*2)|(Plan_Forhire_MS_catch_rate_kg<Forhire_MS_catch_rate_kg/2)){
        Plan_Forhire_MS_catch_rate_kg<-rlnorm(1,log(Forhire_MS_catch_rate_kg),imple_error2)
      }
      cat('\n Plan_Forhire_MS_catch_rate_kg after while: ', Plan_Forhire_MS_catch_rate_kg)
      
      Plan_Forhire_TX_catch_rate_kg<-rlnorm(1,log(Forhire_TX_catch_rate_kg),imple_error2)
      cat('\n Plan_Forhire_TX_catch_rate_kg before while: ', Plan_Forhire_TX_catch_rate_kg)
      while((Plan_Forhire_TX_catch_rate_kg>Forhire_TX_catch_rate_kg*2)|(Plan_Forhire_TX_catch_rate_kg<Forhire_TX_catch_rate_kg/2)){
        Plan_Forhire_TX_catch_rate_kg<-rlnorm(1,log(Forhire_TX_catch_rate_kg),imple_error2)
      }
      cat('\n Plan_Forhire_TX_catch_rate_kg after while: ', Plan_Forhire_TX_catch_rate_kg)

      Quote_private_aftbuf_AL<-Private_quota_AL*Quote_private_aftbuf
      Quote_private_aftbuf_FL<-Private_quota_FL*Quote_private_aftbuf
      Quote_private_aftbuf_LA<-Private_quota_LA*Quote_private_aftbuf
      Quote_private_aftbuf_MS<-Private_quota_MS*Quote_private_aftbuf
      Quote_private_aftbuf_TX<-Private_quota_TX*Quote_private_aftbuf
      cat('\n Quote_private_aftbuf_AL ', Quote_private_aftbuf_AL)
      cat('\n Quote_private_aftbuf_FL ', Quote_private_aftbuf_FL)
      cat('\n Quote_private_aftbuf_LA ', Quote_private_aftbuf_LA)
      cat('\n Quote_private_aftbuf_MS ', Quote_private_aftbuf_MS)
      cat('\n Quote_private_aftbuf_TX ', Quote_private_aftbuf_TX)
      cat('\n Private_quota_AL ', Private_quota_AL)
      cat('\n Private_quota_FL ', Private_quota_FL)
      cat('\n Private_quota_LA ', Private_quota_LA)
      cat('\n Private_quota_MS ', Private_quota_MS)
      cat('\n Private_quota_TX ', Private_quota_TX)
      cat('\n Quote_private_aftbuf ', Quote_private_aftbuf)


      cat('\n Private_season_switch: ',Private_season_switch)
      if(Private_season_switch==1) {
        #determined by ACT
        cat('\n imple_error: ',imple_error)
        Plan_quote_private_AL<-rlnorm(1,log(Quote_private_aftbuf_AL),imple_error)
        while((Plan_quote_private_AL>Quote_private_aftbuf_AL*2)|(Plan_quote_private_AL<Quote_private_aftbuf_AL/2)){
          Plan_quote_private_AL<-rlnorm(1,log(Quote_private_aftbuf_AL),imple_error)
        }
        
        Plan_quote_private_FL<-rlnorm(1,log(Quote_private_aftbuf_FL),imple_error)
        while((Plan_quote_private_FL>Quote_private_aftbuf_FL*2)|(Plan_quote_private_FL<Quote_private_aftbuf_FL/2)){
          Plan_quote_private_FL<-rlnorm(1,log(Quote_private_aftbuf_FL),imple_error)
        }
        
        Plan_quote_private_LA<-rlnorm(1,log(Quote_private_aftbuf_LA),imple_error)
        while((Plan_quote_private_LA>Quote_private_aftbuf_LA*2)|(Plan_quote_private_LA<Quote_private_aftbuf_LA/2)){
          Plan_quote_private_LA<-rlnorm(1,log(Quote_private_aftbuf_LA),imple_error)
        }
        
        Plan_quote_private_MS<-rlnorm(1,log(Quote_private_aftbuf_MS),imple_error)
        while((Plan_quote_private_MS>Quote_private_aftbuf_MS*2)|(Plan_quote_private_MS<Quote_private_aftbuf_MS/2)){
          Plan_quote_private_MS<-rlnorm(1,log(Quote_private_aftbuf_MS),imple_error)
        }
        
        Plan_quote_private_TX<-rlnorm(1,log(Quote_private_aftbuf_TX),imple_error)
        while((Plan_quote_private_TX>Quote_private_aftbuf_TX*2)|(Plan_quote_private_TX<Quote_private_aftbuf_TX/2)){
          Plan_quote_private_TX<-rlnorm(1,log(Quote_private_aftbuf_TX),imple_error)
        }
        
      }else if(Private_season_switch==2) {#input by user
        Plan_quote_private_AL<-(Plan_Private_AL_catch_rate_kg/1000)*Private_AL_season_length
        Plan_quote_private_FL<-(Plan_Private_FL_catch_rate_kg/1000)*Private_FL_season_length
        Plan_quote_private_LA<-(Plan_Private_LA_catch_rate_kg/1000)*Private_LA_season_length
        Plan_quote_private_MS<-(Plan_Private_MS_catch_rate_kg/1000)*Private_MS_season_length + (Plan_Forhire_MS_catch_rate_kg/1000)*Forhire_MS_season_length
        Plan_quote_private_TX<-(Plan_Private_TX_catch_rate_kg/1000)*Private_TX_season_length + (Plan_Forhire_TX_catch_rate_kg/1000)*Forhire_TX_season_length
      }
      cat('\n Plan_quote_private_AL: ',Plan_quote_private_AL)
      cat('\n Plan_quote_private_FL: ',Plan_quote_private_FL)
      cat('\n Plan_quote_private_LA: ',Plan_quote_private_LA)
      cat('\n Plan_quote_private_MS: ',Plan_quote_private_MS)
      cat('\n Plan_quote_private_TX: ',Plan_quote_private_TX)

      cat('\n AL_overunderage_lastyear: ',AL_overunderage_lastyear)
      cat('\n FL_overunderage_lastyear: ',FL_overunderage_lastyear)
      cat('\n LA_overunderage_lastyear: ',LA_overunderage_lastyear)
      cat('\n MS_overunderage_lastyear: ',MS_overunderage_lastyear)
      cat('\n TX_overunderage_lastyear: ',TX_overunderage_lastyear)
      

      Plan_quote_private_AL<-Plan_quote_private_AL+AL_overunderage_lastyear
      Plan_quote_private_FL<-Plan_quote_private_FL+FL_overunderage_lastyear
      Plan_quote_private_LA<-Plan_quote_private_LA+LA_overunderage_lastyear
      Plan_quote_private_MS<-Plan_quote_private_MS+MS_overunderage_lastyear
      Plan_quote_private_TX<-Plan_quote_private_TX+TX_overunderage_lastyear
    
      Comme_planned_catch<-Plan_quote_comm
      Recre_planned_catch<-Plan_quote_forhire + Plan_quote_private_AL + Plan_quote_private_FL + Plan_quote_private_LA + Plan_quote_private_MS + Plan_quote_private_TX

      cat('\n Comme_planned_catch: ', Comme_planned_catch)
      cat('\n Recre_planned_catch: ', Recre_planned_catch)
    
      M_1_relative<-rlnorm(1,0,cv_M_1)
      while ((M_1_relative>2)|(M_1_relative<1/2)){
        M_1_relative<-rlnorm(1,0,cv_M_1)
      }
      cat('\n M_1_relative: ', M_1_relative)
      
      M_2_relative<-rlnorm(1,0,cv_M_2)
      while ((M_2_relative>2)|(M_2_relative<1/2)){
        M_2_relative<-rlnorm(1,0,cv_M_2)
      }
      cat('\n M_2_relative: ', M_2_relative)

      M_1_true<-M_1_relative*M_1
      M_2_true<-M_2_relative*M_2

      cat('\n M_1_true: ', M_1_true)
      cat('\n M_2_true: ', M_2_true)

      relF_comm_imple<-optimize(Function_comm_imple,c(0,10))$minimum
      relF_recr_imple<-optimize(Function_recr_imple,c(0,10))$minimum
      #relF_imple<-optim(c(1, 1),Function_relF_imple,method="Nelder-Mead",hessian=TRUE)$par
      #relF_imple<-optim(c(1, 1),Function_relF_imple,method="L-BFGS-B",lower = c(0,0), upper = c(10,10),hessian=TRUE)$par
      #cat('\n relF_imple: ', relF_imple)
      
      comm_relF_imple<-max(relF_comm_imple,0)
      recr_relF_imple<-max(relF_recr_imple,0)

      cat('\n comm_relF_imple: ', comm_relF_imple)
      cat('\n recr_relF_imple: ', recr_relF_imple) 

      total_F_1_imple<-recr_relF_imple * comp_recr_sel_e + comm_relF_imple * comp_comm_sel_e + recr_relF_imple * comp_recr_discard_e_true + comm_relF_imple * comp_comm_discard_e_true + comp_bycatch_e_true
    
      total_F_2_imple<-recr_relF_imple * comp_recr_sel_w + comm_relF_imple * comp_comm_sel_w + recr_relF_imple * comp_recr_discard_w_true + comm_relF_imple * comp_comm_discard_w_true + comp_bycatch_w_true 
      
      mod_F_1_imple<-recr_relF_imple * comp_recr_sel_e + comm_relF_imple * comp_comm_sel_e
      mod_F_2_imple<-recr_relF_imple * comp_recr_sel_w + comm_relF_imple * comp_comm_sel_w
      
      true_N_1_nextyeartemp<-true_N_1*exp(-total_F_1_imple -M_1_true)
      true_N_2_nextyeartemp<-true_N_2*exp(-total_F_2_imple -M_2_true)
      
      catch_N_1_imple<-(true_N_1-true_N_1_nextyeartemp)*mod_F_1_imple/(total_F_1_imple + M_1_true)
      catch_N_2_imple<-(true_N_2-true_N_2_nextyeartemp)*mod_F_2_imple/(total_F_2_imple + M_2_true)

      cat('\n total_F_1_imple: ', total_F_1_imple)
      cat('\n total_F_2_imple: ', total_F_2_imple) 
      cat('\n mod_F_1_imple: ', mod_F_1_imple)
      cat('\n mod_F_2_imple: ', mod_F_2_imple) 
      cat('\n true_N_1_nextyeartemp: ', true_N_1_nextyeartemp)
      cat('\n true_N_2_nextyeartemp: ', true_N_2_nextyeartemp) 
      cat('\n catch_N_1_imple: ', catch_N_1_imple)
      cat('\n catch_N_2_imple: ', catch_N_2_imple) 
      
      total_SSB[i.run,i.runtime]<-sum(SSB_1[i.run,i.runtime]+SSB_2[i.run,i.runtime])
      totalcatch_1_imple[i.run,i.runtime]<-sum(catch_N_1_imple * weight_at_age_1) #unit mt
      totalcatch_2_imple[i.run,i.runtime]<-sum(catch_N_2_imple * weight_at_age_2) #unit mt
      total_catch[i.run,i.runtime]<-sum(catch_N_1_imple+catch_N_2_imple)
      comm_catch_1[i.run,i.runtime]<-sum((true_N_1-true_N_1_nextyeartemp)*comm_relF_imple * comp_comm_sel_e/(total_F_1_imple + M_1_true)*weight_at_age_1)
      comm_catch_2[i.run,i.runtime]<-sum((true_N_2-true_N_2_nextyeartemp)*comm_relF_imple * comp_comm_sel_w/(total_F_2_imple + M_2_true)*weight_at_age_2)
      comm_catch[i.run,i.runtime]<-comm_catch_1[i.run,i.runtime]+comm_catch_2[i.run,i.runtime]
      recr_catch[i.run,i.runtime]<-sum((true_N_1-true_N_1_nextyeartemp)*recr_relF_imple * comp_recr_sel_e/(total_F_1_imple + M_1_true)*weight_at_age_1+
                                      (true_N_2-true_N_2_nextyeartemp)*recr_relF_imple * comp_recr_sel_w/(total_F_2_imple + M_2_true)*weight_at_age_2)

      cat('\n total_SSB[i.run,i.runtime]: ', total_SSB[i.run,i.runtime])
      cat('\n totalcatch_1_imple[i.run,i.runtime]: ', totalcatch_1_imple[i.run,i.runtime]) 
      cat('\n totalcatch_2_imple[i.run,i.runtime]: ', totalcatch_2_imple[i.run,i.runtime])
      cat('\n total_catch[i.run,i.runtime]: ', total_catch[i.run,i.runtime]) 
      cat('\n comm_catch_1[i.run,i.runtime]: ', comm_catch_1[i.run,i.runtime])
      cat('\n comm_catch_2[i.run,i.runtime]: ', comm_catch_2[i.run,i.runtime]) 
      cat('\n comm_catch[i.run,i.runtime]: ', comm_catch[i.run,i.runtime])
      cat('\n recr_catch[i.run,i.runtime]: ', recr_catch[i.run,i.runtime]) 


      Forhire_catch[i.run,i.runtime]<-recr_catch[i.run,i.runtime]*Plan_quote_forhire/(Recre_planned_catch+0.000001)
      Forhire_catch_1[i.run,i.runtime]<-Forhire_catch[i.run,i.runtime]*Ratio_forhire_east
      Forhire_catch_2[i.run,i.runtime]<-Forhire_catch[i.run,i.runtime]*Ratio_forhire_west
        
      Private_catch[i.run,i.runtime]<-recr_catch[i.run,i.runtime]*(Recre_planned_catch-Plan_quote_forhire)/(Recre_planned_catch+0.000001)  
      Private_catch_1[i.run,i.runtime]<-Private_catch[i.run,i.runtime]*Ratio_private_east
      Private_catch_2[i.run,i.runtime]<-Private_catch[i.run,i.runtime]*Ratio_private_west

      cat('\n Forhire_catch[i.run,i.runtime]: ', Forhire_catch[i.run,i.runtime])
      cat('\n Forhire_catch_1[i.run,i.runtime]: ', Forhire_catch_1[i.run,i.runtime]) 
      cat('\n Forhire_catch_2[i.run,i.runtime]: ', Forhire_catch_2[i.run,i.runtime])
      cat('\n total_catch[i.run,i.runtime]: ', total_catch[i.run,i.runtime]) 
      cat('\n comm_catch_1[i.run,i.runtime]: ', comm_catch_1[i.run,i.runtime])
      cat('\n comm_catch_2[i.run,i.runtime]: ', comm_catch_2[i.run,i.runtime])
      
      comm_discards[i.run,i.runtime]<-sum((true_N_1-true_N_1_nextyeartemp)*(comm_relF_imple * comp_comm_discard_e + comm_closed_e_pred_F_ave * comm_closed_e_selex * Comme_discard_E_closed)/(total_F_1_imple + M_1_true)*weight_at_age_1+
                                          (true_N_2-true_N_2_nextyeartemp)*(comm_relF_imple * comp_comm_discard_w + comm_closed_w_pred_F_ave * comm_closed_w_selex * Comme_discard_W_closed)/(total_F_2_imple + M_2_true)*weight_at_age_2)
      recr_discards[i.run,i.runtime]<-sum((true_N_1-true_N_1_nextyeartemp)*(recr_relF_imple * comp_recr_discard_e + rec_closed_e_pred_F_ave * rec_closed_e_selex * Recre_discard_E_closed)/(total_F_1_imple + M_1_true)*weight_at_age_1+
                                          (true_N_2-true_N_2_nextyeartemp)*(recr_relF_imple * comp_recr_discard_w + rec_closed_w_pred_F_ave * rec_closed_w_selex * Recre_discard_W_closed)/(total_F_2_imple + M_2_true)*weight_at_age_2)
      comm_disalloratio[i.run,i.runtime]<-comm_discards[i.run,i.runtime]/(Comme_planned_catch+0.000001)
      recr_disalloratio[i.run,i.runtime]<-recr_discards[i.run,i.runtime]/(Recre_planned_catch+0.000001)

      cat('\n comm_discards[i.run,i.runtime]: ', comm_discards[i.run,i.runtime])
      cat('\n recr_discards[i.run,i.runtime]: ', recr_discards[i.run,i.runtime]) 
      cat('\n comm_disalloratio[i.run,i.runtime]: ', comm_disalloratio[i.run,i.runtime])
      cat('\n recr_disalloratio[i.run,i.runtime]: ', recr_disalloratio[i.run,i.runtime]) 
      
      true_private_AL_catch[i.run,i.runtime]<-recr_catch[i.run,i.runtime]*Plan_quote_private_AL/(Recre_planned_catch+0.000001)
      true_private_FL_catch[i.run,i.runtime]<-recr_catch[i.run,i.runtime]*Plan_quote_private_FL/(Recre_planned_catch+0.000001)
      true_private_LA_catch[i.run,i.runtime]<-recr_catch[i.run,i.runtime]*Plan_quote_private_LA/(Recre_planned_catch+0.000001)
      true_private_MS_catch[i.run,i.runtime]<-recr_catch[i.run,i.runtime]*Plan_quote_private_MS/(Recre_planned_catch+0.000001)
      true_private_TX_catch[i.run,i.runtime]<-recr_catch[i.run,i.runtime]*Plan_quote_private_TX/(Recre_planned_catch+0.000001)
      true_fed_forhire_season_length[i.run,i.runtime]<-round(Forhire_catch[i.run,i.runtime]/(Plan_Forhire_federal_catch_rate_kg/1000))
      true_private_AL_season_length[i.run,i.runtime]<-round(true_private_AL_catch[i.run,i.runtime]/(Plan_Private_AL_catch_rate_kg/1000))
      true_private_FL_season_length[i.run,i.runtime]<-round(true_private_FL_catch[i.run,i.runtime]/(Plan_Private_FL_catch_rate_kg/1000))
      true_private_LA_season_length[i.run,i.runtime]<-round(true_private_LA_catch[i.run,i.runtime]/(Plan_Private_LA_catch_rate_kg/1000))
      true_private_MS_season_length[i.run,i.runtime]<-max(0,round((true_private_MS_catch[i.run,i.runtime]-Plan_Forhire_MS_catch_rate_kg/1000*Forhire_MS_season_length)/(Plan_Private_MS_catch_rate_kg/1000)))
      true_private_TX_season_length[i.run,i.runtime]<-max(0,round((true_private_TX_catch[i.run,i.runtime]-Plan_Forhire_TX_catch_rate_kg/1000*Forhire_TX_season_length)/(Plan_Private_TX_catch_rate_kg/1000)))
      
      cat('\n true_private_AL_catch[i.run,i.runtime]: ', true_private_AL_catch[i.run,i.runtime])
      cat('\n true_private_FL_catch[i.run,i.runtime]: ', true_private_FL_catch[i.run,i.runtime]) 
      cat('\n true_private_LA_catch[i.run,i.runtime]: ', true_private_LA_catch[i.run,i.runtime])
      cat('\n true_private_MS_catch[i.run,i.runtime]: ', true_private_MS_catch[i.run,i.runtime]) 
      cat('\n true_private_TX_catch[i.run,i.runtime]: ', true_private_TX_catch[i.run,i.runtime])
      cat('\n true_fed_forhire_season_length[i.run,i.runtime]: ', true_fed_forhire_season_length[i.run,i.runtime])
      cat('\n true_private_AL_season_length[i.run,i.runtime]: ', true_private_AL_season_length[i.run,i.runtime])
      cat('\n true_private_FL_season_length[i.run,i.runtime]: ', true_private_FL_season_length[i.run,i.runtime]) 
      cat('\n true_private_LA_season_length[i.run,i.runtime]: ', true_private_LA_season_length[i.run,i.runtime])
      cat('\n true_private_MS_season_length[i.run,i.runtime]: ', true_private_MS_season_length[i.run,i.runtime]) 
      cat('\n true_private_TX_season_length[i.run,i.runtime]: ', true_private_TX_season_length[i.run,i.runtime])

      #estimate AM overunderage for the next year
      AM_forhire_overunderage[i.run,i.runtime+1]<-Plan_quote_forhire-Forhire_catch[i.run,i.runtime]
      AM_AL_overunderage[i.run,i.runtime+1]<-Plan_quote_private_AL-true_private_AL_catch[i.run,i.runtime]
      AM_FL_overunderage[i.run,i.runtime+1]<-Plan_quote_private_FL-true_private_FL_catch[i.run,i.runtime]
      AM_LA_overunderage[i.run,i.runtime+1]<-Plan_quote_private_LA-true_private_LA_catch[i.run,i.runtime]
      AM_MS_overunderage[i.run,i.runtime+1]<-Plan_quote_private_MS-true_private_MS_catch[i.run,i.runtime]
      AM_TX_overunderage[i.run,i.runtime+1]<-Plan_quote_private_TX-true_private_TX_catch[i.run,i.runtime]

      cat('\n AM_forhire_overunderage[i.run,i.runtime+1]: ', AM_forhire_overunderage[i.run,i.runtime+1])
      cat('\n AM_AL_overunderage[i.run,i.runtime+1]: ', AM_AL_overunderage[i.run,i.runtime+1])
      cat('\n AM_FL_overunderage[i.run,i.runtime+1]: ', AM_FL_overunderage[i.run,i.runtime+1]) 
      cat('\n AM_LA_overunderage[i.run,i.runtime+1]: ', AM_LA_overunderage[i.run,i.runtime+1])
      cat('\n AM_MS_overunderage[i.run,i.runtime+1]: ', AM_MS_overunderage[i.run,i.runtime+1]) 
      cat('\n AM_TX_overunderage[i.run,i.runtime+1]: ', AM_TX_overunderage[i.run,i.runtime+1])
      
      overunderage<-ACL_planned-total_catch[i.run,i.runtime] #overage for the next year
      
      F_general[i.run,i.runtime]<-sum((true_N_1-true_N_1_nextyeartemp)*total_F_1_imple/(total_F_1_imple + M_1_true)+(true_N_2-true_N_2_nextyeartemp)*total_F_2_imple/(total_F_2_imple + M_2_true))/sum(true_N_1+true_N_2)
      
      cat('\n ACL_planned: ', ACL_planned)
      cat('\n overunderage: ', overunderage)
      cat('\n F_general[i.run,i.runtime]: ', F_general[i.run,i.runtime]) 
      #If no assessment error 
      true_N_1[2:(length(true_N_1)-1)]<-true_N_1_nextyeartemp[1:(length(true_N_1)-2)]
      true_N_2[2:(length(true_N_2)-1)]<-true_N_2_nextyeartemp[1:(length(true_N_2)-2)]
      true_N_1[length(true_N_1)]<-true_N_1_nextyeartemp[length(true_N_1)-1]+true_N_1_nextyeartemp[length(true_N_1)]
      true_N_2[length(true_N_2)]<-true_N_2_nextyeartemp[length(true_N_2)-1]+true_N_2_nextyeartemp[length(true_N_2)]


      true_N_1[1]<-true_R_1
      true_N_2[1]<-true_R_2

      cat('\n true_N_1[2:(length(true_N_1)-1)]: ', true_N_1[2:(length(true_N_1)-1)])
      cat('\n true_N_2[2:(length(true_N_2)-1)]: ', true_N_2[2:(length(true_N_2)-1)])
      cat('\n true_N_1[length(true_N_1)]: ', true_N_1[length(true_N_1)])
      cat('\n true_N_2[length(true_N_2)]: ', true_N_2[length(true_N_2)])
      cat('\n true_N_1[1]: ', true_N_1[1])
      cat('\n true_N_2[1]: ', true_N_2[1])


      
      cat('\n SSB_MSY_BRP: ', SSB_MSY_BRP)
      if((SSB_1[i.run,i.runtime]+SSB_2[i.run,i.runtime])>=SSB_MSY_BRP){
        if(F_general[i.run,i.runtime]<=MFMT){
          Year_green[i.run,i.runtime]<-1 #1: green 
        }else{
          Year_green[i.run,i.runtime]<--2 #2: grey green -2
        }
      }else{
        if(F_general[i.run,i.runtime]<=MFMT){
          Year_green[i.run,i.runtime]<--3 #1: orange -3
        }else{
          Year_green[i.run,i.runtime]<--4 #2: red -4
        }
      }
      cat('\n MFMT: ', MFMT)
      cat('\n Year_green[i.run,i.runtime]: ',Year_green[i.run,i.runtime] )
        
      F_ratio[i.run,i.runtime]<-F_general[i.run,i.runtime]/MFMT
      SSB_ratio[i.run,i.runtime]<-(SSB_1[i.run,i.runtime]+SSB_2[i.run,i.runtime])/SSB_MSY_BRP

      cat('\n F_ratio[i.run,i.runtime]: ', F_ratio[i.run,i.runtime])
      cat('\n SSB_ratio[i.run,i.runtime]: ', SSB_ratio[i.run,i.runtime])
      cat('\n *******************************')
      
    }
  }



  library(matrixStats)
  #save the following matrix for figures:
  #Essential Figure
  proj_year<-project_start_year:(project_start_year+Runtime_long-1)

  #Figure 1 Line Gardient of total catch and total SSB, use median of 100 runs
  total_catch_median<-colMedians(total_catch)*2.2046
  total_SSB_median<-colMedians(total_SSB)

  # plot(proj_year,total_catch_median, ylim=c(0,max(total_catch_median)*1.2))
  # plot(proj_year,total_SSB_median, ylim=c(0,max(total_SSB_median)*1.2))

  #Figure 2 Starcked Area Chart, use mean of 100 runs
  #total_catch_mean<-colMeans(total_catch)
  comm_catch_mean<-colMeans(comm_catch)*2.2046
  Forhire_catch_mean<-colMeans(Forhire_catch)*2.2046
  Private_catch_mean<-colMeans(Private_catch)*2.2046

  # plot(proj_year,comm_catch_mean, ylim=c(0,max(comm_catch_mean)*1.2))
  # plot(proj_year,Forhire_catch_mean, ylim=c(0,max(Forhire_catch_mean)*1.2))
  # plot(proj_year,Private_catch_mean, ylim=c(0,max(Private_catch_mean)*1.2))

  #Figure 3 Starcked Area Chart, use mean of 100 runs
  #total_SSB_mean<-colMeans(total_SSB)
  SSB_1_mean<-colMeans(SSB_1[,1:Runtime_long])
  SSB_2_mean<-colMeans(SSB_2[,1:Runtime_long])

  # plot(proj_year,SSB_1_mean, ylim=c(0,max(SSB_1_mean)*1.2))
  # plot(proj_year,SSB_2_mean, ylim=c(0,max(SSB_2_mean)*1.2))

  #Figure 4 Starcked Area Chart, use mean of 100 runs
  #comm_catch_mean<-colMeans(comm_catch)
  comm_catch_1_mean<-colMeans(comm_catch_1)*2.2046
  comm_catch_2_mean<-colMeans(comm_catch_2)*2.2046

  # plot(proj_year,comm_catch_1_mean, ylim=c(0,max(comm_catch_1_mean)*1.2))
  # plot(proj_year,comm_catch_2_mean, ylim=c(0,max(comm_catch_2_mean)*1.2))

  #Figure 5 Starcked Area Chart, use mean of 100 runs
  #Forhire_catch_mean<-colMeans(Forhire_catch)
  Forhire_catch_1_mean<-colMeans(Forhire_catch_1)*2.2046
  Forhire_catch_2_mean<-colMeans(Forhire_catch_2)*2.2046
  # plot(proj_year,Forhire_catch_1_mean, ylim=c(0,max(Forhire_catch_1)*1.2))
  # plot(proj_year,Forhire_catch_2_mean, ylim=c(0,max(Forhire_catch_2)*1.2))

  #Figure 6 Starcked Area Chart, use mean of 100 runs
  #Private_catch_mean<-colMeans(Private_catch)
  Private_catch_1_mean<-colMeans(Private_catch_1)*2.2046
  Private_catch_2_mean<-colMeans(Private_catch_2)*2.2046
  # plot(proj_year,Private_catch_1_mean, ylim=c(0,max(Private_catch_1)*1.2))
  # plot(proj_year,Private_catch_2_mean, ylim=c(0,max(Private_catch_2)*1.2))

  #Figure 7 Bar Simple with variation, use median, and 95% CI of 100 runs
  true_fed_forhire_season_length_median<-colMedians(true_fed_forhire_season_length)
  true_fed_forhire_season_length_975<-apply(true_fed_forhire_season_length, 2, quantile, probs=0.975)
  true_fed_forhire_season_length_025<-apply(true_fed_forhire_season_length, 2, quantile, probs=0.025)

  #Figure 8 Share Dataset without the pie plot, use median of 100 runs
  true_private_AL_season_length_median<-colMedians(true_private_AL_season_length)
  true_private_FL_season_length_median<-colMedians(true_private_FL_season_length)  
  true_private_LA_season_length_median<-colMedians(true_private_LA_season_length)  
  true_private_MS_season_length_median<-colMedians(true_private_MS_season_length)  
  true_private_TX_season_length_median<-colMedians(true_private_TX_season_length)  

  #Figure 9 Kobe plot, use median of 100 runs
  SSB_ratio_median<-colMedians(SSB_ratio)
  F_ratio_median<-colMedians(F_ratio)
  # plot(SSB_ratio_median,F_ratio_median,type="l")

  #Figure 10 Starcked Area Chart, use mean of 100 runs
  R_1_mean<-colMeans(R_1[,1:Runtime_long])
  R_2_mean<-colMeans(R_2[,1:Runtime_long])

  #Other figures
  #Figure 1 Confidence Band
  comm_catch_median<-colMedians(comm_catch)*2.2046
  comm_catch_975<-apply(comm_catch, 2, quantile, probs=0.975)*2.2046
  comm_catch_025<-apply(comm_catch, 2, quantile, probs=0.025)*2.2046

  #Figure 2 Confidence Band
  recr_catch_median<-colMedians(recr_catch)*2.2046
  recr_catch_975<-apply(recr_catch, 2, quantile, probs=0.975)*2.2046
  recr_catch_025<-apply(recr_catch, 2, quantile, probs=0.025)*2.2046

  #Figure 3 Confidence Band
  Forhire_catch_median<-colMedians(Forhire_catch)*2.2046
  Forhire_catch_975<-apply(Forhire_catch, 2, quantile, probs=0.975)*2.2046
  Forhire_catch_025<-apply(Forhire_catch, 2, quantile, probs=0.025)*2.2046

  #Figure 4 Confidence Band
  Private_catch_median<-colMedians(Private_catch)*2.2046
  Private_catch_975<-apply(Private_catch, 2, quantile, probs=0.975)*2.2046
  Private_catch_025<-apply(Private_catch, 2, quantile, probs=0.025)*2.2046

  #Figure 5 Confidence Band
  F_general_median<-colMedians(F_general)
  F_general_975<-apply(F_general, 2, quantile, probs=0.975)
  F_general_025<-apply(F_general, 2, quantile, probs=0.025)

  #Figure 6 Confidence Band
  SSB_1_median<-colMedians(SSB_1[,1:Runtime_long])
  SSB_1_975<-apply(SSB_1[,1:Runtime_long], 2, quantile, probs=0.975)
  SSB_1_025<-apply(SSB_1[,1:Runtime_long], 2, quantile, probs=0.025)

  #Figure 7 Confidence Band
  SSB_2_median<-colMedians(SSB_2[,1:Runtime_long])
  SSB_2_975<-apply(SSB_2[,1:Runtime_long], 2, quantile, probs=0.975)
  SSB_2_025<-apply(SSB_2[,1:Runtime_long], 2, quantile, probs=0.025)

  #Figure 8 Confidence Band
  total_SSB_median<-colMedians(total_SSB)
  total_SSB_975<-apply(total_SSB, 2, quantile, probs=0.975)
  total_SSB_025<-apply(total_SSB, 2, quantile, probs=0.025)

  #Figure 9 Confidence Band
  true_private_AL_catch_median<-colMedians(true_private_AL_catch)*2.2046
  true_private_AL_catch_975<-apply(true_private_AL_catch, 2, quantile, probs=0.975)*2.2046
  true_private_AL_catch_025<-apply(true_private_AL_catch, 2, quantile, probs=0.025)*2.2046

  #Figure 10 Confidence Band
  true_private_AL_season_length_median<-colMedians(true_private_AL_season_length)
  true_private_AL_season_length_975<-apply(true_private_AL_season_length, 2, quantile, probs=0.975)
  true_private_AL_season_length_025<-apply(true_private_AL_season_length, 2, quantile, probs=0.025)

  #Figure 11 Confidence Band
  true_private_FL_catch_median<-colMedians(true_private_FL_catch)*2.2046
  true_private_FL_catch_975<-apply(true_private_FL_catch, 2, quantile, probs=0.975)*2.2046
  true_private_FL_catch_025<-apply(true_private_FL_catch, 2, quantile, probs=0.025)*2.2046

  #Figure 12 Confidence Band
  true_private_FL_season_length_median<-colMedians(true_private_FL_season_length)
  true_private_FL_season_length_975<-apply(true_private_FL_season_length, 2, quantile, probs=0.975)
  true_private_FL_season_length_025<-apply(true_private_FL_season_length, 2, quantile, probs=0.025)

  #Figure 13 Confidence Band
  true_private_LA_catch_median<-colMedians(true_private_LA_catch)*2.2046
  true_private_LA_catch_975<-apply(true_private_LA_catch, 2, quantile, probs=0.975)*2.2046
  true_private_LA_catch_025<-apply(true_private_LA_catch, 2, quantile, probs=0.025)*2.2046

  #Figure 14 Confidence Band
  true_private_LA_season_length_median<-colMedians(true_private_LA_season_length)
  true_private_LA_season_length_975<-apply(true_private_LA_season_length, 2, quantile, probs=0.975)
  true_private_LA_season_length_025<-apply(true_private_LA_season_length, 2, quantile, probs=0.025)

  #Figure 15 Confidence Band
  true_private_MS_catch_median<-colMedians(true_private_MS_catch)*2.2046
  true_private_MS_catch_975<-apply(true_private_MS_catch, 2, quantile, probs=0.975)*2.2046
  true_private_MS_catch_025<-apply(true_private_MS_catch, 2, quantile, probs=0.025)*2.2046

  #Figure 16 Confidence Band
  true_private_MS_season_length_median<-colMedians(true_private_MS_season_length)
  true_private_MS_season_length_975<-apply(true_private_MS_season_length, 2, quantile, probs=0.975)
  true_private_MS_season_length_025<-apply(true_private_MS_season_length, 2, quantile, probs=0.025)

  #Figure 17 Confidence Band
  true_private_TX_catch_median<-colMedians(true_private_TX_catch)*2.2046
  true_private_TX_catch_975<-apply(true_private_TX_catch, 2, quantile, probs=0.975)*2.2046
  true_private_TX_catch_025<-apply(true_private_TX_catch, 2, quantile, probs=0.025)*2.2046

  #Figure 18 Confidence Band
  true_private_TX_season_length_median<-colMedians(true_private_TX_season_length)
  true_private_TX_season_length_975<-apply(true_private_TX_season_length, 2, quantile, probs=0.975)
  true_private_TX_season_length_025<-apply(true_private_TX_season_length, 2, quantile, probs=0.025)



  #### MSE comparison, need the same data for every scenario. Most of them have already exist in the previous section
  #Essential Figures
  #Figure 1 Basic Line Chart or The second half of the Shared Dataset
  total_catch_median<-colMedians(total_catch)*2.2046

  #Figure 2 Basic Line Chart or The second half of the Shared Dataset
  total_SSB_median<-colMedians(total_SSB)

  #Figure 3 Basic simple with variation
  total_catch_MSEcomp<-rowSums(total_catch)*2.2046
  total_catch_median_MSEcomp<-median(total_catch_MSEcomp)*2.2046
  total_catch_upper_MSEcomp<-median(total_catch_MSEcomp)*2.2046+sd(total_catch_MSEcomp)*2.2046
  total_catch_lower_MSEcomp<-median(total_catch_MSEcomp)*2.2046-sd(total_catch_MSEcomp)*2.2046
  #calculate variation from Simrun_Num of results

  #Figure 4 Basic simple with variation
  catch_var_MSEcomp<-rowSds(total_catch)/rowMeans(total_catch)
  catch_var_median_MSEcomp<-median(catch_var_MSEcomp)
  catch_var_upper_MSEcomp<-median(catch_var_MSEcomp)+sd(catch_var_MSEcomp)
  catch_var_lower_MSEcomp<-median(catch_var_MSEcomp)-sd(catch_var_MSEcomp)
  #calculate variation from Simrun_Num of results

  #Figure 5 Basic simple with variation
  terminal_SSB_MSEcomp<-total_SSB[,ncol(total_SSB)]
  terminal_SSB_median_MSEcomp<-median(terminal_SSB_MSEcomp)
  terminal_SSB_upper_MSEcomp<-median(terminal_SSB_MSEcomp)+sd(terminal_SSB_MSEcomp)
  terminal_SSB_lower_MSEcomp<-median(terminal_SSB_MSEcomp)-sd(terminal_SSB_MSEcomp)
  #calculate variation from Simrun_Num of results

  #Figure 6 Basic simple with variation
  lowest_SSB_MSEcomp<-rowMins(total_SSB) 
  lowest_SSB_median_MSEcomp<-median(lowest_SSB_MSEcomp)
  lowest_SSB_upper_MSEcomp<-median(lowest_SSB_MSEcomp)+sd(lowest_SSB_MSEcomp)
  lowest_SSB_lower_MSEcomp<-median(lowest_SSB_MSEcomp)-sd(lowest_SSB_MSEcomp)
  #calculate variation from Simrun_Num of results

  #Figure 7 Basic bar simple
  percent_green_MSEcomp<-sum(Year_green>0)/(Simrun_Num*Runtime_long)
  #calculate variation from Simrun_Num of results

  #Figure 8 Basic Rader Chart median of the Figure 3-7
  total_catch_MSEcomp_median<-median(total_catch_MSEcomp)*2.2046
  catch_var_MSEcomp_median<-median(catch_var_MSEcomp)
  terminal_SSB_MSEcomp_median<-median(terminal_SSB_MSEcomp)
  lowest_SSB_MSEcomp_median<-median(lowest_SSB_MSEcomp)
  percent_green_MSEcomp

  #Figure 9 Basic simple with variation
  total_discards_MSEcomp<-rowSums(comm_discards+recr_discards)*2.2046
  total_discards_median_MSEcomp<-median(total_discards_MSEcomp)*2.2046
  total_discards_upper_MSEcomp<-median(total_discards_MSEcomp)*2.2046+sd(total_discards_MSEcomp)*2.2046
  total_discards_lower_MSEcomp<-median(total_discards_MSEcomp)*2.2046-sd(total_discards_MSEcomp)*2.2046

  #Figure 10 Basic simple with variation
  discards_var_MSEcomp<-rowSds(comm_discards+recr_discards)/rowMeans(comm_discards+recr_discards)
  discards_var_median_MSEcomp<-median(discards_var_MSEcomp)
  discards_var_upper_MSEcomp<-median(discards_var_MSEcomp)+sd(discards_var_MSEcomp)
  discards_var_lower_MSEcomp<-median(discards_var_MSEcomp)-sd(discards_var_MSEcomp)

  #Other Detailed Figures
  #Section 2: Sector Comparison
  #Figure 1 Basic Line chart or Shared Dataset Chart
  comm_catch_median<-colMedians(comm_catch)*2.2046

  #Figure 2 Basic Line chart or Shared Dataset Chart
  Forhire_catch_median<-colMedians(Forhire_catch)*2.2046

  #Figure 3 Basic Line chart or Shared Dataset Chart
  Private_catch_median<-colMedians(Private_catch)*2.2046

  #Figure 4 Basic bar simple with variation
  total_SSB_first5median<-rowMeans(total_SSB[,1:5])
  total_SSB_first5median_median<-median(total_SSB_first5median)
  total_SSB_first5median_upper<-median(total_SSB_first5median)+sd(total_SSB_first5median)
  total_SSB_first5median_lower<-median(total_SSB_first5median)-sd(total_SSB_first5median)

  #Figure 5 Basic bar simple with variation
  total_SSB_last5median<-rowMeans(total_SSB[,(Runtime_long-4):Runtime_long])
  total_SSB_last5median_median<-median(total_SSB_last5median)
  total_SSB_last5median_upper<-median(total_SSB_last5median)+sd(total_SSB_last5median)
  total_SSB_last5median_lower<-median(total_SSB_last5median)-sd(total_SSB_last5median)

  #Figure 6 Bar label rotation, maybe with variation?
  Forhire_catch_first5median<-median(rowMeans(Forhire_catch[,1:5]))*2.2046
  Private_catch_first5median<-median(rowMeans(Private_catch[,1:5]))*2.2046
  Forhire_catch_last5median<-median(rowMeans(Forhire_catch[,(Runtime_long-4):Runtime_long]))*2.2046
  Private_catch_last5median<-median(rowMeans(Private_catch[,(Runtime_long-4):Runtime_long]))*2.2046

  #Figure 7 Bar label rotation, maybe with variation?
  true_private_AL_catch_first5median<-median(rowMeans(true_private_AL_catch[,1:5]))*2.2046
  true_private_FL_catch_first5median<-median(rowMeans(true_private_FL_catch[,1:5]))*2.2046
  true_private_LA_catch_first5median<-median(rowMeans(true_private_LA_catch[,1:5]))*2.2046
  true_private_MS_catch_first5median<-median(rowMeans(true_private_MS_catch[,1:5]))*2.2046
  true_private_TX_catch_first5median<-median(rowMeans(true_private_TX_catch[,1:5]))*2.2046

  #Figure 8 Bar label rotation, maybe with variation?
  true_private_AL_catch_last5median<-median(rowMeans(true_private_AL_catch[,(Runtime_long-4):Runtime_long]))*2.2046
  true_private_FL_catch_last5median<-median(rowMeans(true_private_FL_catch[,(Runtime_long-4):Runtime_long]))*2.2046
  true_private_LA_catch_last5median<-median(rowMeans(true_private_LA_catch[,(Runtime_long-4):Runtime_long]))*2.2046
  true_private_MS_catch_last5median<-median(rowMeans(true_private_MS_catch[,(Runtime_long-4):Runtime_long]))*2.2046
  true_private_TX_catch_last5median<-median(rowMeans(true_private_TX_catch[,(Runtime_long-4):Runtime_long]))*2.2046

  #Figure 9 Bar label rotation, maybe with variation?
  true_private_AL_season_length_first5median<-median(rowMeans(true_private_AL_season_length[,1:5]))
  true_private_FL_season_length_first5median<-median(rowMeans(true_private_FL_season_length[,1:5]))
  true_private_LA_season_length_first5median<-median(rowMeans(true_private_LA_season_length[,1:5]))
  true_private_MS_season_length_first5median<-median(rowMeans(true_private_MS_season_length[,1:5]))
  true_private_TX_season_length_first5median<-median(rowMeans(true_private_TX_season_length[,1:5]))

  #Figure 10 Bar label rotation, maybe with variation?
  true_private_AL_season_length_last5median<-median(rowMeans(true_private_AL_season_length[,(Runtime_long-4):Runtime_long]))
  true_private_FL_season_length_last5median<-median(rowMeans(true_private_FL_season_length[,(Runtime_long-4):Runtime_long]))
  true_private_LA_season_length_last5median<-median(rowMeans(true_private_LA_season_length[,(Runtime_long-4):Runtime_long]))
  true_private_MS_season_length_last5median<-median(rowMeans(true_private_MS_season_length[,(Runtime_long-4):Runtime_long]))
  true_private_TX_season_length_last5median<-median(rowMeans(true_private_TX_season_length[,(Runtime_long-4):Runtime_long]))

  #Figure 11 Basic bar simple with variation
  total_catch_first5median<-rowMeans(total_catch[,1:5])*2.2046
  total_catch_first5median_median<-median(total_catch_first5median)*2.2046
  total_catch_first5median_upper<-median(total_catch_first5median)*2.2046+sd(total_catch_first5median)*2.2046
  total_catch_first5median_lower<-median(total_catch_first5median)*2.2046-sd(total_catch_first5median)*2.2046

  #Figure 12 Basic bar simple with variation
  total_catch_last5median<-rowMeans(total_catch[,(Runtime_long-4):Runtime_long])*2.2046
  total_catch_last5median_median<-median(total_catch_last5median)*2.2046
  total_catch_last5median_upper<-median(total_catch_last5median)*2.2046+sd(total_catch_last5median)*2.2046
  total_catch_last5median_lower<-median(total_catch_last5median)*2.2046-sd(total_catch_last5median)*2.2046

  #Figure 13 Basic Line chart or Shared Dataset Chart
  comm_discards_median<-colMedians(comm_discards)*2.2046

  #Figure 14 Basic Line chart or Shared Dataset Chart
  recr_discards_median<-colMedians(recr_discards)*2.2046

  #Section 3: Within Sector Comparison
  #Figure 1 Basic Rader Chart
  comm_catch_var_MSEcomp<-median(rowSds(comm_catch)/rowMeans(comm_catch))
  comm_catch_first5median_MSEcomp<-median(rowMeans(comm_catch[,1:5]))*2.2046
  comm_catch_last5median_MSEcomp<-median(rowMeans(comm_catch[,(Runtime_long-4):Runtime_long]))*2.2046
  total_SSB_last5median_MSEcomp<-median(rowMeans(total_SSB[,(Runtime_long-4):Runtime_long]))
  percent_green_MSEcomp<-sum(Year_green>0)/(Simrun_Num*Runtime_long)
  comm_disalloratio_ave20_MSEcomp<-median(rowMeans(comm_disalloratio))

  #Figure 2 Basic Rader Chart
  recr_catch_var_MSEcomp<-median(rowSds(recr_catch)/rowMeans(recr_catch))
  Forhire_catch_first5median_MSEcomp<-median(rowMeans(Forhire_catch[,1:5]))*2.2046
  Private_catch_first5median_MSEcomp<-median(rowMeans(Private_catch[,1:5]))*2.2046
  Forhire_catch_last5median_MSEcomp<-median(rowMeans(Forhire_catch[,(Runtime_long-4):Runtime_long]))*2.2046
  Private_catch_last5median_MSEcomp<-median(rowMeans(Private_catch[,(Runtime_long-4):Runtime_long]))*2.2046
  total_SSB_last5median_MSEcomp<-median(rowMeans(total_SSB[,(Runtime_long-4):Runtime_long]))
  percent_green_MSEcomp<-sum(Year_green>0)/(Simrun_Num*Runtime_long)
  recr_disalloratio_ave20_MSEcomp<-median(rowMeans(recr_disalloratio))

  ## MSE advanced compare
  # change target F and commercial and recreational ratio. make target SSB grey.
  # call above simulation for multiple times...
  # for every run record total catch, catch variation, terminal SSB, lowest SSB, and year to green.

  ######### new program end ##############
  resultlist<-cbind(c(proj_year) ,total_catch_median,total_SSB_median,comm_catch_mean,Forhire_catch_mean,Private_catch_mean
                    ,SSB_1_mean,SSB_2_mean,comm_catch_1_mean,comm_catch_2_mean,Forhire_catch_1_mean,Forhire_catch_2_mean,Private_catch_1_mean,Private_catch_2_mean
                    ,true_fed_forhire_season_length_median,true_fed_forhire_season_length_975,true_fed_forhire_season_length_025
                    ,true_private_AL_season_length_median,true_private_FL_season_length_median,true_private_LA_season_length_median,true_private_MS_season_length_median,true_private_TX_season_length_median
                    ,SSB_ratio_median,F_ratio_median,R_1_mean,R_2_mean,comm_catch_median,comm_catch_975,comm_catch_025,recr_catch_median,recr_catch_975,recr_catch_025
                    ,Forhire_catch_median,Forhire_catch_975,Forhire_catch_025,Private_catch_median,Private_catch_975,Private_catch_025
                    ,F_general_median,F_general_975,F_general_025,SSB_1_median,SSB_1_975,SSB_1_025,SSB_2_median,SSB_2_975,SSB_2_025
                    ,total_SSB_median,total_SSB_975,total_SSB_025,true_private_AL_catch_median,true_private_AL_catch_975,true_private_AL_catch_025
                    ,true_private_AL_season_length_975,true_private_AL_season_length_025
                    ,true_private_FL_catch_median,true_private_FL_catch_975,true_private_FL_catch_025
                    ,true_private_FL_season_length_975,true_private_FL_season_length_025
                    ,true_private_LA_catch_median,true_private_LA_catch_975,true_private_LA_catch_025
                    ,true_private_LA_season_length_975,true_private_LA_season_length_025
                    ,true_private_MS_catch_median,true_private_MS_catch_975,true_private_MS_catch_025
                    ,true_private_MS_season_length_975,true_private_MS_season_length_025
                    ,true_private_TX_catch_median,true_private_TX_catch_975,true_private_TX_catch_025
                    ,true_private_TX_season_length_975,true_private_TX_season_length_025
                    )
  colnames(resultlist) <- c("year","total_catch_median","total_SSB_median","comm_catch_mean","Forhire_catch_mean","Private_catch_mean"
                    ,"SSB_1_mean","SSB_2_mean","comm_catch_1_mean","comm_catch_2_mean","Forhire_catch_1_mean","Forhire_catch_2_mean","Private_catch_1_mean","Private_catch_2_mean"
                    ,"true_fed_forhire_season_length_median","true_fed_forhire_season_length_975","true_fed_forhire_season_length_025"
                    ,"true_private_AL_season_length_median","true_private_FL_season_length_median","true_private_LA_season_length_median","true_private_MS_season_length_median","true_private_TX_season_length_median"
                    ,"SSB_total_ratio_median","F_general_ratio_median","R_1_mean","R_2_mean","comm_catch_median","comm_catch_975","comm_catch_025","recr_catch_median","recr_catch_975","recr_catch_025"
                    ,"Forhire_catch_median","Forhire_catch_975","Forhire_catch_025","Private_catch_median","Private_catch_975","Private_catch_025"
                    ,"F_general_median","F_general_975","F_general_025","SSB_1_median","SSB_1_975","SSB_1_025","SSB_2_median","SSB_2_975","SSB_2_025"
                    ,"SSB_total_median","SSB_total_975","SSB_total_025","true_private_AL_catch_median","true_private_AL_catch_975","true_private_AL_catch_025"
                    ,"true_private_AL_season_length_975","true_private_AL_season_length_025"
                    ,"true_private_FL_catch_median","true_private_FL_catch_975","true_private_FL_catch_025"
                    ,"true_private_FL_season_length_975","true_private_FL_season_length_025"
                    ,"true_private_LA_catch_median","true_private_LA_catch_975","true_private_LA_catch_025"
                    ,"true_private_LA_season_length_975","true_private_LA_season_length_025"
                    ,"true_private_MS_catch_median","true_private_MS_catch_975","true_private_MS_catch_025"
                    ,"true_private_MS_season_length_975","true_private_MS_season_length_025"
                    ,"true_private_TX_catch_median","true_private_TX_catch_975","true_private_TX_catch_025"
                    ,"true_private_TX_season_length_975","true_private_TX_season_length_025"
                    )
                    
  print("here after resultlist 1")
  library("RJSONIO")
  library("plyr")
  resultJson<-toJSON(unname(alply(resultlist,1,identity)))

  #to prevent single values from being stored in an array in json conversion
  toJSON_scalar<-function(value){
    toJSON(value,container=FALSE)
  }

  mseCompFields <- paste('{"total_catch_median_MSEcomp":',toJSON_scalar(total_catch_median_MSEcomp),',"total_catch_upper_MSEcomp":',toJSON_scalar(total_catch_upper_MSEcomp),',"total_catch_lower_MSEcomp":',toJSON_scalar(total_catch_lower_MSEcomp)
                          ,',"catch_var_median_MSEcomp":',toJSON_scalar(catch_var_median_MSEcomp),',"catch_var_upper_MSEcomp":',toJSON_scalar(catch_var_upper_MSEcomp),',"catch_var_lower_MSEcomp":',toJSON_scalar(catch_var_lower_MSEcomp)
                          ,',"terminal_SSB_median_MSEcomp":',toJSON_scalar(terminal_SSB_median_MSEcomp),',"terminal_SSB_upper_MSEcomp":',toJSON_scalar(terminal_SSB_upper_MSEcomp),',"terminal_SSB_lower_MSEcomp":',toJSON_scalar(terminal_SSB_lower_MSEcomp)
                          ,',"lowest_SSB_median_MSEcomp":',toJSON_scalar(lowest_SSB_median_MSEcomp),',"lowest_SSB_upper_MSEcomp":',toJSON_scalar(lowest_SSB_upper_MSEcomp),',"lowest_SSB_lower_MSEcomp":',toJSON_scalar(lowest_SSB_lower_MSEcomp),',"percent_green_MSEcomp":',toJSON_scalar(percent_green_MSEcomp)
                          ,',"total_catch_MSEcomp_median":',toJSON_scalar(total_catch_MSEcomp_median),',"catch_var_MSEcomp_median":',toJSON_scalar(catch_var_MSEcomp_median),',"terminal_SSB_MSEcomp_median":',toJSON_scalar(terminal_SSB_MSEcomp_median),',"lowest_SSB_MSEcomp_median":',toJSON_scalar(lowest_SSB_MSEcomp_median)
                          ,',"total_discards_median_MSEcomp":',toJSON_scalar(total_discards_median_MSEcomp),',"total_discards_upper_MSEcomp":',toJSON_scalar(total_discards_upper_MSEcomp),',"total_discards_lower_MSEcomp":',toJSON_scalar(total_discards_lower_MSEcomp)
                          ,',"discards_var_median_MSEcomp":',toJSON_scalar(discards_var_median_MSEcomp),',"discards_var_upper_MSEcomp":',toJSON_scalar(discards_var_upper_MSEcomp),',"discards_var_lower_MSEcomp":',toJSON_scalar(discards_var_lower_MSEcomp)
                          ,',"total_SSB_first5median_median":',toJSON_scalar(total_SSB_first5median_median),',"total_SSB_first5median_upper":',toJSON_scalar(total_SSB_first5median_upper),',"total_SSB_first5median_lower":',toJSON_scalar(total_SSB_first5median_lower)
                          ,',"total_SSB_last5median_median":',toJSON_scalar(total_SSB_last5median_median),',"total_SSB_last5median_upper":',toJSON_scalar(total_SSB_last5median_upper),',"total_SSB_last5median_lower":',toJSON_scalar(total_SSB_last5median_lower)
                          ,',"Forhire_catch_first5median":',toJSON_scalar(Forhire_catch_first5median),',"Private_catch_first5median":',toJSON_scalar(Private_catch_first5median),',"Forhire_catch_last5median":',toJSON_scalar(Forhire_catch_last5median),',"Private_catch_last5median":',toJSON_scalar(Private_catch_last5median)
                          ,',"true_private_AL_catch_first5median":',toJSON_scalar(true_private_AL_catch_first5median),',"true_private_FL_catch_first5median":',toJSON_scalar(true_private_FL_catch_first5median),',"true_private_LA_catch_first5median":',toJSON_scalar(true_private_LA_catch_first5median),',"true_private_MS_catch_first5median":',toJSON_scalar(true_private_MS_catch_first5median),',"true_private_TX_catch_first5median":',toJSON_scalar(true_private_TX_catch_first5median)
                          ,',"true_private_AL_catch_last5median":',toJSON_scalar(true_private_AL_catch_last5median),',"true_private_FL_catch_last5median":',toJSON_scalar(true_private_FL_catch_last5median),',"true_private_LA_catch_last5median":',toJSON_scalar(true_private_LA_catch_last5median),',"true_private_MS_catch_last5median":',toJSON_scalar(true_private_MS_catch_last5median),',"true_private_TX_catch_last5median":',toJSON_scalar(true_private_TX_catch_last5median)
                          ,',"true_private_AL_season_length_first5median":',toJSON_scalar(true_private_AL_season_length_first5median),',"true_private_FL_season_length_first5median":',toJSON_scalar(true_private_FL_season_length_first5median),',"true_private_LA_season_length_first5median":',toJSON_scalar(true_private_LA_season_length_first5median),',"true_private_MS_season_length_first5median":',toJSON_scalar(true_private_MS_season_length_first5median),',"true_private_TX_season_length_first5median":',toJSON_scalar(true_private_TX_season_length_first5median)
                          ,',"true_private_AL_season_length_last5median":',toJSON_scalar(true_private_AL_season_length_last5median),',"true_private_FL_season_length_last5median":',toJSON_scalar(true_private_FL_season_length_last5median),',"true_private_LA_season_length_last5median":',toJSON_scalar(true_private_LA_season_length_last5median),',"true_private_MS_season_length_last5median":',toJSON_scalar(true_private_MS_season_length_last5median),',"true_private_TX_season_length_last5median":',toJSON_scalar(true_private_TX_season_length_last5median)
                          ,',"total_catch_first5median_median":',toJSON_scalar(total_catch_first5median_median),',"total_catch_first5median_upper":',toJSON_scalar(total_catch_first5median_upper),',"total_catch_first5median_lower":',toJSON_scalar(total_catch_first5median_lower)
                          ,',"total_catch_last5median_median":',toJSON_scalar(total_catch_last5median_median),',"total_catch_last5median_upper":',toJSON_scalar(total_catch_last5median_upper),',"total_catch_last5median_lower":',toJSON_scalar(total_catch_last5median_lower)
                          ,',"comm_discards_median":',toJSON(comm_discards_median),',"recr_discards_median":',toJSON(recr_discards_median),',"comm_catch_var_MSEcomp":',toJSON_scalar(comm_catch_var_MSEcomp),',"comm_catch_first5median_MSEcomp":',toJSON_scalar(comm_catch_first5median_MSEcomp)
                          ,',"comm_catch_last5median_MSEcomp":',toJSON_scalar(comm_catch_last5median_MSEcomp),',"total_SSB_last5median_MSEcomp":',toJSON_scalar(total_SSB_last5median_MSEcomp),',"comm_disalloratio_ave20_MSEcomp":',toJSON_scalar(comm_disalloratio_ave20_MSEcomp),',"comm_disalloratio_ave20_MSEcomp":',toJSON_scalar(comm_disalloratio_ave20_MSEcomp)
                          ,',"recr_catch_var_MSEcomp":',toJSON_scalar(recr_catch_var_MSEcomp),',"Forhire_catch_first5median_MSEcomp":',toJSON_scalar(Forhire_catch_first5median_MSEcomp),',"Private_catch_first5median_MSEcomp":',toJSON_scalar(Private_catch_first5median_MSEcomp),',"Forhire_catch_last5median_MSEcomp":',toJSON_scalar(Forhire_catch_last5median_MSEcomp),',"Private_catch_last5median_MSEcomp":',toJSON_scalar(Private_catch_last5median_MSEcomp),',"recr_disalloratio_ave20_MSEcomp":',toJSON_scalar(recr_disalloratio_ave20_MSEcomp)
                          ,'}',sep = "")

  mongo <- mongo.create(host = "127.0.0.1", username = "",password = "", db = "fishery")
  print(mongo.oid.from.string(process_gen_id))
  resultListJson <- paste('{"process_gen_id":"',process_gen_id,'","resultlist":',resultJson,',"mseCompFields":',mseCompFields,'}',sep = "")

  print("here after resultlist 2")
  result_list<-mongo.bson.from.JSON(resultListJson)
  mongo.remove(mongo,"fishery.mse_result_list",list(process_gen_id=process_gen_id))
  mongo.insert(mongo,"fishery.mse_result_list",result_list)

  print("success")

  return(resultJson)

}

#* Echo back the input,for testing the service is ready or not
#* @param msg The message to echo
#* @get /echo
function(msg=""){
  list(msg = paste0("The message is: '", msg, "'"))
}

if(FALSE){
    ####################################################################
    ##  The following codes illustrate how to get value from mongodb  ##
    ##  based on getMSEInfo function.                                 ##
    ####################################################################
    #invoke Rmongo to get data from mongodb,"5b02cc1b360e2e8f7f93d438", try to get this id from mongo client

    mse_result <- getMSEInfo("5c2d31ab360e2ea33f0a15f7")
    rnd_file_list<-mongo.bson.value(mse_result, "rnd_seed_file")
    getRondomFile(mongo.oid.to.string(rnd_file_list[1]$`0`),"~/")
    mse_iniPopu = mongo.bson.value(mse_result, "iniPopu")

    age_1<-rep(0,length(mse_iniPopu))
    age_2<-rep(0,length(mse_iniPopu))
    stock_1_mean<-rep(0,length(mse_iniPopu))
    stock_2_mean<-rep(0,length(mse_iniPopu))

    for(i.db in 1:length(mse_iniPopu)){
      age_1[i.db]<-i.db-1
      stock_1_mean[i.db]<-mse_iniPopu[[i.db]]$stock_1_mean
      age_2[i.db]<-i.db-1
      stock_2_mean[i.db]<-mse_iniPopu[[i.db]]$stock_2_mean
    }
    #see all the values inside
    #get a specific value
    print(mongo.bson.value(mse_info, "mixing_pattern"))
    print(as.Date(mongo.bson.value(mse_info, "start_projection")))
    #get a list
    iniPopuList <-mongo.bson.value(mse_info, "iniPopu")
    #get a value in the list
    print(iniPopuList$`0`$age_1)
    #iterate the list to get all value
    for(i in iniPopuList){print(i)}
    #get rnd_seed_file then you can use R to read the file as you want
    #rnd_file<-mongo.bson.value(mse_info, "rnd_seed_file")$'0'
    #print(as.character(rnd_file))
    #rondomFile<-getGridfsFile(as.character(rnd_file),"/Users/yli120/Documents/")
    #need to name plumber function as saveGlobalFile before testing
    #saveGlobalFile('5b72d902360e2e20451dc0e4',"/Users/yli120/")




}
