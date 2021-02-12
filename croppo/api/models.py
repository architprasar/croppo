from django.db import models
from PIL import Image
from io import BytesIO
from django.core.files.uploadedfile import InMemoryUploadedFile
import sys

class img(models.Model):    
    image = models.ImageField(upload_to='images/user')

    def save(self,dict):
        if not self.id:
            self.image = compressImage2(self.image ,dict)
        else:
            self.image = compressImage2(self.image,dict)
        super().save()
def compressImage2(images,dict):
    imageTemporary = Image.open(images)
    outputstream = BytesIO()
    imageTemporary2 = imageTemporary.crop((dict['left'], dict['top'], dict['right'],  dict['bottom']))
    imageTemporary2.save(outputstream, format='JPEG', quality=40)
    outputstream.seek(0)
    images = InMemoryUploadedFile(outputstream, 'ImageField', "%s.jpg" % images.name.split('.')[
        0], 'image/jpeg', sys.getsizeof(outputstream), None)
    return images
