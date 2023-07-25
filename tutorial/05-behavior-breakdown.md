# Chapter 5: Breaking down tests by behaviors

In this chapter,
we will break down the test we wrote in the previous chapter
by separating unique behaviors into independent, atomic tests.


## Identifying unique behaviors

Currently, we have one test that performs 5 steps:

1. load the app
2. create a new board
3. create a new list
4. add cards to the list
5. navigate to the home page

Each of these steps covers a unique behavior.
If any one of these behaviors were to fail, it would fail the whole test.
That's not ideal:
each behavior should have its own test to report its own result.

Each one of these behaviors could be its own test.
Each one could also have vectors for related but distinct behaviors as well.
For example, the card behaviors include:

* adding one card
* adding multiple cards
* deleting a card
* editing a card's name
* moving a card to change the order of a list
* moving a card to a different list

All of these behaviors have a common starting point:
There must be a board with a list (or multiple lists).
These tests could share common setup steps.
Other behaviors might need some of the same setup step,
but they might also have other needs.

The more tests we add to our growing suite,
the more important it will become to keep them atomic and independent.
Let's split up the one big test we have into smaller tests
that each cover an individual behavior.


## Splitting behaviors into separate tests

?


## Optimizing setup steps

?


## Rerunning the tests

?
