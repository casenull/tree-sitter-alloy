[
    (or)
    (and)
    (not)
    (neq)
    (eq)
    (lt)
    (lte)
    (gt)
    (gte)
    (add)
    (sub)
    (mul)
    (div)
    (mod)
    (pow)
] @operator

[
 "{"
 "}"
 "["
 "]"
 "("
 ")"
] @punctuation.bracket

[
 "."
 ","
] @punctuation.delimiter

"=" @none

(string) @string

[
 (float)
 (number)
] @number

(bool) @boolean

(null) @constant

(comment) @spell @comment

(block_name) @keyword

(oper_expr
  (ident) @function
  (call_expr))

(attribute
  (ident) @variable.member)

(field
  (ident) @variable.member)

; @variable.builtin
