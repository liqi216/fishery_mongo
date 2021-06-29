

#install.packages("plumber")
#setwd('/Users/yli120/Documents/fisheryPrj/fishery_mongo/app/rScript')
library(plumber)
r <- plumb("rmongo.r")  # Where 'plumber.R' is the location of the file shown above
r$run(port=8000)

