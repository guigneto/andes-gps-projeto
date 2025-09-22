import 'terminals'
import 'helpers'
import 'requirement'
import 'entities'


Actor:
    (Comment)?
    // TODO Talvez o entity deva ser só LocalEntity
    'actor' name=QualifiedName 'is' entity=[Entity:QualifiedName] ('extends' superType=[Actor:QualifiedName])?
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
         |'action' ':' action=STRING(',' action+=STRING)?
         |'requirements'':' requirement= [FunctionalRequirement:QualifiedName](',' requirements+=[FunctionalRequirement:QualifiedName])?         
         |'depend'':' depend= [Event:QualifiedName](',' depends+=[Event:QualifiedName])?
         |'performer' ':' actors+=[Actor:QualifiedName](',' actors+=[Actor:QualifiedName])*
        )*
    '}'
;
