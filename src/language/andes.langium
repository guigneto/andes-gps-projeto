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
               |'Architecture'':' architcture=Architecture
            )* 
        '}'
;

AbstractElement:
    Module | EnumX  
;

Module:
    'module' name=QualifiedName '{'
        | Description
        (
        elements+=(AbstractElement | LocalEntity)
        )*
    '}'
; 