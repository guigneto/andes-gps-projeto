import 'terminals'

QualifiedName returns string:
    ID ('.' ID)*
;

QualifiedNameWithWildcard returns string:
    QualifiedName '.*'?
;

fragment Description:
    'description' ':' description=STRING
;
fragment Name:
    'name' ':' name_fragment=STRING
;
fragment Priority:
    'priority' ':' priority=STRING
;
