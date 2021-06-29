from mongoengine import Document, EmbeddedDocument
from mongoengine import DateTimeField, StringField, ReferenceField, ListField, FileField, IntField, SequenceField,DecimalField,EmbeddedDocumentListField,EmbeddedDocumentField
import mongoengine

def mongo_to_dict(obj):
    return_data = []

    if isinstance(obj, Document):
        return_data.append(("id",str(obj.id)))

    for field_name in obj._fields:

        if field_name in ("id",):
            continue

        data = obj._data[field_name]
        
        if isinstance(obj._fields[field_name], mongoengine.fields.EmbeddedDocumentListField):
            embedData = []     
            for embedObj in data:
                embedData.append(mongo_to_dict(embedObj))
            return_data.append((field_name, embedData))
        
        elif isinstance(obj._fields[field_name], DateTimeField):
            return_data.append((field_name, str(data.isoformat())))
        elif isinstance(obj._fields[field_name], StringField):
            return_data.append((field_name, str(data)))
        elif isinstance(obj._fields[field_name], DecimalField):
            return_data.append((field_name, float(data)))
        elif isinstance(obj._fields[field_name], IntField):
            return_data.append((field_name, int(data)))
        elif isinstance(obj._fields[field_name], ListField):
            return_data.append((field_name, data))
        #elif isinstance(obj._fields[field_name], EmbeddedDocumentField):
        #    return_data.append((field_name, mongo_to_dict(data)))

    print(return_data)
    return dict(return_data)