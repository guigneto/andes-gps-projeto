import 'terminals'
import 'helpers'


type Requirement=(FunctionalRequirement | NonFunctionalRequirement);

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