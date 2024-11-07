grammar Andes
import 'terminals'
import 'helpers'
import 'requirement'
import 'usecase'
import 'entities'

entry Model:    
    
    (   project = Project
        |components+=(Requirements|UseCase|Actor|AbstractElement|ModuleImport)
    )*;

Project:
        'overview' id=ID '{'
            (  Name
               |Description
               |'purpose' ':' purpose= STRING
               |'miniworld' ':' miniworld= STRING
            )* 
        '}'
;

AbstractElement:
    Module | EnumX  
;

Module:
    (Comment)?
    'module' name=QualifiedName '{'
        (elements+=(AbstractElement | LocalEntity))*
    '}'
; 