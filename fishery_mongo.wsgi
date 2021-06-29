#!/usr/bin/python3
activate_this = '/home/yinli/gitRepo/venv/bin/activate_this.py'
with open(activate_this) as file_:
    exec(file_.read(), dict(__file__=activate_this))

import sys
sys.path.insert(0, '/home/yinli/gitRepo/fishery_mongo')

from app import app as application