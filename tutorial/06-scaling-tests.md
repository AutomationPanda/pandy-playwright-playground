# Chapter 6: Scaling tests with parallel execution

In this chapter,
we will improve our tests so that we can scale them up
by running them in parallel across different browsers.


## Attempting parallel execution

Ever since we started writing tests for the Trello-like app,
We have run our tests *serially*, meaning one at a time.
Try running them in *parallel*, and watch what happens:

```
npx playwright test tests/trello.spec.ts
```

Inevitably, some of the tests will fail due to a *collision* on the test data.
Before each test, the suite resets the whole database.
All tests target one instance of the Trello-like app running on the local machine,
so resetting the database impacts *all* tests that happen to be running.
Resetting at just the wrong moment can destroy the boards, lists, and cards that tests needed.


## Evaluating data management strategies

?


## ??? (pick the strategy)

?


## Running the tests at scale

?
