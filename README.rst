mongodb create user:
db.createUser({'user':'fishery','pwd':'fishery123',roles:[{'role':'readWrite','db':'admin'},{'role':'dbAdmin','db':'admin'}]})
