import os

files = [
    r"e:\Project\Ram\web\src\app\terms\page.tsx",
    r"e:\Project\Ram\web\src\app\support\page.tsx",
    r"e:\Project\Ram\web\src\app\privacy\page.tsx",
    r"e:\Project\Ram\web\src\app\about\page.tsx",
    r"e:\Project\Ram\web\src\components\features\support\ContactSupportForm.tsx",
    r"e:\Project\Ram\web\src\components\features\landing\why-choose-us.tsx"
]

for f in files:
    if os.path.exists(f):
        with open(f, 'r', encoding='utf-8') as file:
            content = file.read()
        
        content = content.replace("NextGen Careers", "Skillsutra")
        content = content.replace("NextGen Career", "Skillsutra")
        content = content.replace("NextGenCareer", "Skillsutra")
        content = content.replace("nextgencareers.com", "skillsutra.com")
        
        with open(f, 'w', encoding='utf-8') as file:
            file.write(content)
        print(f"Updated {f}")
    else:
        print(f"Skipped {f} (not found)")
