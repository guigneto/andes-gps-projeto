grammar Andes
import 'terminals'
import 'helpers'

type Requirement=(FunctionalRequirement | NonFunctionalRequirement);

entry Model:    
    
    (   project = Project
        |components+=(Requirements|UseCase|Actor)
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


Requirements: 
    'requirements' id=ID '{'
        (Name
        |Description
        |requirements+=(FunctionalRequirement|NonFunctionalRequirement|BussinesRule))*
    '}'
;  


FunctionalRequirement:
    'functional_requirement' id=ID '{'
        (Description
        |Priority 
        |'depend'':' depend= [Requirement:QualifiedName](',' depends+=[Requirement:QualifiedName])?  
        )*
    '}'
;

NonFunctionalRequirement:
    'non_functional_requirement' id=ID '{'
        ( Description
        |Priority  
        |'depend'':' depend= [Requirement:QualifiedName]*(',' depends+=[Requirement:QualifiedName])?
        )*
    '}'
;

BussinesRule:
    'bussines_rule' id=ID '{'
        ( Description
        | Priority 
        | 'depend'':' depend= [Requirement:QualifiedName]*(',' depends+=[Requirement:QualifiedName])?
        )*
    '}'
;

UseCase:
    'usecase' id=ID '{'
        (Name
         |Description
         |'requirements'':' requirement= [Requirement:QualifiedName](',' requirements+=[Requirement:QualifiedName])?         
         |events+=Event 
         |'depend'':' depend= [UseCase:QualifiedName](',' depends+=[UseCase:QualifiedName])?
         |'performer' ':' actors+=[Actor:QualifiedName](',' actors+=[Actor:QualifiedName])*
        )*
    '}'
;

Event:
    'event' id=ID '{'
         (Name
         |Description
         |'action' ':' action=STRING
         |'requirements'':' requirement= [FunctionalRequirement:QualifiedName](',' requirements+=[FunctionalRequirement:QualifiedName])?         
         |'depend'':' depend= [Event:QualifiedName](',' depends+=[Event:QualifiedName])?
        )*
    '}';

// Definição de Atores
Actor:
    'actor' id=QualifiedName '{'
        (
        Name
        |'extends' superType=[Actor:QualifiedName]
        )?
    '}'
;
