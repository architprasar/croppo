from PIL import Image 
  
# Opens a image in RGB mode 
im = Image.open(r"./l.jpg") 
  
# Size of the image in pixels (size of orginal image) 

width, height = im.size 
print(str(width) +" "+ str(height))
# 837.8906249999999 1327.21875 1662.375 1173.046875
#  1193.15625 429 1293.703125 2057.859375
# Setting the points for cropped image 
left = 837.8906249999999
top = 1327.21875
bottom = 1662.375 
right = 1173.046875
  
# Cropped image of above dimension 
# (It will not change orginal image) 
im1 = im.crop((left, top, right, bottom)) 
  
 
im1.show() 