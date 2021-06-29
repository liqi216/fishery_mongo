from flask_appbuilder.security.mongoengine.models import RegisterUser, Role, get_user_id
from flask_appbuilder._compat import as_unicode
from mongoengine import Document
from mongoengine import DateTimeField, StringField, ReferenceField, ListField, BooleanField, IntField, DateTimeField
import datetime
from flask import g

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

    def is_authenticated(self):
        return True


    def is_active(self):
        return self.active

    def is_anonymous(self):
        return False

    def get_id(self):
        return as_unicode(self.id)

    def get_full_name(self):
        return u"{0} {1}".format(self.first_name, self.last_name)

    def __unicode__(self):
        return self.get_full_name()


class MyRegisterUser(Document):
    first_name = StringField(max_length=64, required=True)
    last_name = StringField(max_length=64, required=True)
    username = StringField(max_length=64, required=True, unique=True)
    affiliation = StringField(max_length = 64)
    password = StringField(max_length=256)
    email = StringField(max_length=64, required=True)
    registration_date = DateTimeField(default=datetime.datetime.now)
    registration_hash = StringField(max_length=256)
