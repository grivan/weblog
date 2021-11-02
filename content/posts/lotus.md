---
title: "Probability, statistics and law of the unconscious statistician"
date: 2021-10-31T19:23:26-07:00
draft: false
math: true
---
If you want to learn about introductory probability and statistics this post is for you. It covers
random variables, probability distributions, and basic mathematical constructs around
probability distributions. I've been re-visiting my probability theory recent times and
decided to make a post about it. If you are only interested in LOTUS (Law of the
unconscious statistician), scroll to the last section of the post!

### What is a random variable?
A random variable is a real-valued (real number) mathematical variable that helps
assigns a numerical value to an outcome of an experiment. Mathematically
speaking, a random variable $X$ is a function from the sample space (of an observation)
to a real number, like the height of men from a certain region.

$$ X: S \rarr R \tag{1} $$

There are discrete random variables and continuous random variables. Specifically, a
discrete random variable has a range that is countable. A continuous random variable, on the other hand, can have an infinite set of possible values between any two discrete values. Think of how many decimal points you could add to the space between discrete values 10 and 11 to generate many continuous variable values.

Now that we know what a random variable is, let's dive into mathematical constructs that statisticians use to describe the possible values that random variables could have. We'll dive into probability distribution first.

### What is a probability distribution?
A probability distribution is a function that provides likeliness values for an outcome
in an experiment or in a set of observations. Speaking in terms of random variables, a probability
distribution quantifies the possibility of values that the random variable could be assigned given a set
of constraints of observation.

For a discrete random variable $X$, a probability distribution (also known as a **Probability
  Mass Function**) can be defined as follows:

$$P_X(x_k) = P(X = x_k), \text{for k=1,2,3...} \tag{2}$$

For example, $P_X(1)$ is the probability that the random variable $X$ has an outcome of $ 1$ (or $X = 1$).

There are a few interesting properties of **PMFs**:

1. The probability can only be between 0 and 1 for any occurrence.

$$ 0\leq P_X(x) \leq 1, \text{for all x} \tag{3}$$

2. The sum of the probabilities over all occurrences is 1.

$$\sum_{x\isin R_x} P_X(x) = 1 \tag{4}$$

3. And finally, for any set $A\subset R_X$

$$ P(X \isin A) = \sum_{x\isin A}P_X(x) \tag{5}$$.

PMFs aren't the only way to describe a random variable $X$, so let's look at the CDF next.

### What is a cumulative distribution function (CDF)?
Besides a probability distribution, another useful way to describe the likely values that a random
variable could have is with a cumulative distribution function - a description of the
**cumulative** probability of values a random variable $X$ could have:

$$F_X(x) = P(X\leq x), \text{ for all } x\isin R \tag{6}$$

For example, if the sample space of a random variable is $[1, 2, 3, 4]$ then
$$F_X(3) = P_X(X=1) + P_X(X=2) + P_X(X=3)$$

Note that either a PMF or a CDF completely describes a discrete random variable.
That is, if PMF is known, then we can find the CDF from it and vice versa.

$$ F_X(x) = \sum_{x_k \leq x } P_X(x_k) \tag{7}$$

### What is a probability density function?
So far we have seen how to describe a discrete random variable via it's probability
distribution and the cumulative distribution function. However, the definition of
probability distribution does not quite work for **continuous random variables**.
This is because for a continuous random variable:

$$P(X=x)=0 \text{ for all } x\isin\Reals \tag{8}$$.

Formally, a **Probability Density Function** or PDF is the limit of the probability
of the interval $(x, x + \Delta]$ divided by the length of the interval:

$$ f_X(x) = \lim_{\Delta\to0^+} \frac{P(x \lt X \leq x + \Delta)}{\Delta} \tag{9}$$

The equation $(9)$ can also be written in the form of a differential of the CDF of a
continuous random variable X:

$$ f_X(x) = \cfrac{dF_X(x)}{dx} = F\'\_X(x) \tag{10}$$

This concept is similar to mass density in physics, i.e. it is the unit
probability per unit length.

A few properties apply for **PDFs**:

1. The probability density for a continuous random variable is always greater than or equal to 0.
$$ f_X(x) \geq 0 \text{ for all } x\isin \Reals \tag{11}$$
2. The integral of a PDF is 1.
$$ \int_{-\infty}^\infty f_X(u)du = 1 \tag{12}$$
3. The probability between intervals can be calculated as:
$$ P(a \lt X \leq b)  = F_X(b) - F_X(a) = \int_{a}^bf_X(u)du \tag{13}$$
4. More generally for a set $A$,
$$ P(X \isin A) = \int_Af_X(u)du \tag{14}$$

Generally, the theory of continuous random variables is completely analogous to
the theory of discrete random variables. One can take a formula that applies to
discrete random variables and replace the sums with integrals and replace
Probability Mass Functions (PMF) with Probability Density Functions (PDFs) and
the formula will work for a continuous random variable. We'll see this action in the
next sections.

### What is an expected value?
The expected value (or mean) of a random variable is defined as the probability weighted
average of the possible range of the random variable:

$$EX = \sum_{x_k \isin R_x}x_kP(X=x_k) \tag{15}$$

The intuition behind $EX$ is that if the random experiment is repeated N times and
the average of the outcomes is taken, the average will get closer and closer to
$EX$ as the number of repetitions (N) gets larger and larger.

For a continuous random variable, the expected value can be defined as:

$$EX = \int_{-\infty}^\infty xf_X(x)dx \tag{16}$$

Where $f_X(x)$ is the PDF of the continuous random variable.

### What is variance?
Variance describes the spread of probability in the range of a random variable. If
the variance is small, then the distribution (or the spread) is concentrated at a single
value. On the other extreme, variance is large when the distribution is more spread
out.

$$Var(X) = E[(X - \mu_X)^2] = EX^2 - (EX)^2\tag{17} $$

Where $\mu X = EX$ = expected value. The equation can also be reworded to say that the variance
of $X$ is the average value of $(X-\mu_X)^2$.

And for continuous random variables:

$$Var(X) = \int_{-\infty}^\infty (x - \mu_X)^2 f_X(x) dx =
\int_{-\infty}^\infty x^2f_X(x)dx - \mu_X^2 \tag{18}$$

An important property of variance is:

$$Var(aX + b) = a^2Var(X) \tag{19}$$

### What is standard deviation?
Standard deviation is simply the square root of variance!

$$SD(X) = \sigma_x = \sqrt{Var(X)} \tag{20}$$

### What is the Law of the Unconscious Statistician (LOTUS)?
LOTUS describes a shortcut to find the expected value for a function of a random variable.
Let's define a random variable $Y = g(X)$, then the expected value of this random variable
can be written as:

$$E[g(X)] = \sum_{x_k \isin R_X} g(x_k)P_X(x_k) \tag{21}$$

Similarly, for continuous random variables the law states:

$$E[g(X)] = \int_{-\infty}^\infty g(x)f_X(x)dx \tag{22}$$

As for the name, according to Wikipedia:

> This (LOTUS) proposition is known as the law of the unconscious statistician because of a purported tendency to use the identity without realizing that it must be treated as the result of a rigorously proved theorem, not merely a definition.

-------
That's it! If you have followed along so far, you've come a long way in understanding
the basics! I'm hoping to write another post soon on a few important probability
distributions and will hopefully integrate with d3 to be able to visualize them! Stay tuned.
