# 42-ComputorV2

![CodeFactor](https://www.codefactor.io/repository/github/kibotrel/42-computorv2/badge)
![GitHub](https://img.shields.io/github/license/kibotrel/42-ComputorV2?color=blue)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/kibotrel/42-ComputorV2?label=size)
![Lines of code](https://img.shields.io/tokei/lines/github/kibotrel/42-ComputorV2?label=code%20lines)

This project provides you an advanced maths interpreter interface highly inspired by Linux [`bc`](https://linux.die.net/man/1/bc).

## :hammer_and_wrench: Install

First, you'll need to get yourself [node.js](https://nodejs.org/en/download/) v16 and install some packages to get [plotter](https://www.npmjs.com/package/plotter) dependency working as expected.

- Linux, use your distribution packets manager:

  ```shell
    $> sudo apt-get install gnuplot ghostscript
  ```

- macOS, use [Homebrew](https://brew.sh/):

  ```shell
    $> brew install gnuplot ghostscript
  ```

Then all you have to do is installing package dependencies:

```shell
  $> npm install
```

## :computer: Usage

Run the interpeter with:

```shell
  $> node computor.js
```

### Features

- Computing:

  Handles simple expression with addition, substraction, multiplication, division, power and modulus operators with brakect priorities.

  ```
    > 2 + 23 * (8.23 / (2 - 7)) = ?
  ```

  It also supports complex numbers and unary operators.

  ```
    > -2.23 + (-2.1) / 3.08i = ?
  ```

  This evaluation algorithm also support variables which are explained bellow, both **Numeral** and **Matrix** variables are used in the same way, call its name and it will be evaluated before the whole input.

  ```
    > 57 + x / 723.2 = ?
  ```

  For **Expression** variables, you get to give them the right amount of parameters to evaluate their images.

  ```
    > 2.8211 * f(23) = ?
  ```

  > All of the variable types supports unary operator which means you can get the opposite of any variable by putting a minus sign before in your input.

- Storing variables:

  This program allows you to compute and keep three different types of variables. First, **Numeral**, basically representing numbers from integers to complex ones.

  ```
    > x = -7.5 + 82i
  ```

  > It computes the result of the left term and then assign it to the requested variable.

  Then we have **Matrix** type that holds 2D Matrix only.

  ```
    > m = [[ 2, 0, -3 ]; [ 7, 0.82, -12 ]]
  ```

  > Supports other Numerals and Expression images as well (described bellow) in each term of the matrix.

  Finally, **Expression** which are simply functions that take variables.

  ```
    > f(x, y, z) = x - 6.2 / y + 2 * z
  ```

  > You can create Expression with arbitrary number of variables, no limit.
