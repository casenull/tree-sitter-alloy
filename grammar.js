/**
 * @file Grafana Alloy's configuration language.
 * @author Łukasz Klimek
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "alloy",

  extras: $ => [
    /[\s\n]/,
    $.comment,
  ],

  rules: {
    source_file: $ => $._body,
    _body: $ => seq(
      $._statement,
      repeat($._statement),
    ),
    _statement: $ => seq(choice($.attribute, $.block), "\n"),
    attribute: $ => seq(
      $.ident,
      $._assign,
      $._expression,
    ),
    block: $ => seq(
      $.block_name,
      $._lcurly,
      optional($._body),
      $._rcurly,
    ),
    block_name: $ => seq(
      $.ident,
      repeat(seq($._dot, $.ident)),
      optional($.string),
    ),
    _expression: $ => prec(1, choice(
      $._primary_expr,
      $._unary_expr,
      $.bin_op_expr,
    )),
    bin_op_expr: $ => choice(
      prec.left(1, seq($._expression, $.or, $._expression)),
      prec.left(2, seq($._expression, $.and, $._expression)),
      prec.left(3, seq($._expression, $._cmp_op, $._expression)),
      prec.left(4, seq($._expression, $._add_op, $._expression)),
      prec.left(5, seq($._expression, $._mul_op, $._expression)),
      prec.right(6, seq($._expression, $.pow, $._expression)),
    ),
    _cmp_op: $ => choice(
      $.eq, $.neq,
      $.lt, $.lte,
      $.gt, $.gte,
    ),
    _add_op: $ => choice(
      $.add, $.sub,
    ),
    _mul_op: $ => choice(
      $.mul, $.div,
      $.mod,
    ),
    _unary_expr: $ => choice(
      $.oper_expr,
      seq($._unary_op, $._unary_expr),
    ),
    oper_expr: $ => seq(
      $._primary_expr,
      repeat(choice(
        $.access_expr,
        $.index_expr,
        $.call_expr,
      )),
    ),
    access_expr: $ => seq($._dot, $.ident),
    index_expr: $ => seq(
      $._lbrack,
      optional($._expression),
      $._rbrack,
    ),
    call_expr: $ => seq(
      $._lparen,
      optional($.expression_list),
      $._rparen,
    ),
    _unary_op: $ => choice(
      $.not,
      $.sub,
    ),
    _primary_expr: $ => choice(
      $._literal_value,
      $.array_expr,
      $.object_expr,
    ),
    _literal_value: $ => choice(
      $.ident,
      $.string,
      $.number,
      $.float,
      $.bool,
      $.null,
      seq($._lparen, $._expression, $._rparen),
    ),
    array_expr: $ => seq(
      $._lbrack,
      optional($.expression_list),
      $._rbrack,
    ),
    object_expr: $ => seq(
      $._lcurly,
      optional($.field_list),
      $._rcurly,
    ),
    expression_list: $ => seq(
      $._expression,
      repeat(seq($._comma, $._expression)),
      optional($._comma),
    ),
    field_list: $ => seq(
      $.field,
      repeat(seq($._comma, $.field)),
      optional($._comma),
    ),
    field: $ => seq(
      choice($.string, $.ident),
      $._assign,
      $._expression,
    ),

    // tokens
    comment: $ => choice(
      seq("//", /.*/),
      seq("/*", /[^*]*\*+([^/*][^*]*\*+)*/, "/"),
    ),
    ident: $ => /[\p{gc=Letter}_][\p{gc=Letter}_\p{gc=Number}]*/,
    null: $ => "null",
    bool: $ => choice("true", "false"),
    number: $ => /[0-9]+/,
    float: $ => /([0-9]+(\.[0-9]+)?|\.[0-9]+)(e(\+|-)?[0-9]+)?/,
    string: $ => /"([^"\n\\]|\\([abfnrtv\\"]|[0-7]{3}|x[0-9A-Za-z]{2}|u[0-9A-Za-z]{4}|[0-9A-Za-z]{8}))*"/,
    or: $ => "||",
    and: $ => "&&",
    not: $ => "!",
    neq: $ => "!=",
    _assign: $ => "=",
    eq: $ => "==",
    lt: $ => "<",
    lte: $ => "<=",
    gt: $ => ">",
    gte: $ => ">=",
    add: $ => "+",
    sub: $ => "-",
    mul: $ => "*",
    div: $ => "/",
    mod: $ => "%",
    pow: $ => "^",
    _lcurly: $ => "{",
    _rcurly: $ => "}",
    _lparen: $ => "(",
    _rparen: $ => ")",
    _lbrack: $ => "[",
    _rbrack: $ => "]",
    _comma: $ => ",",
    _dot: $ => ".",
  },
});
