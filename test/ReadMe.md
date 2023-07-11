<!-- SeleniumBase Docs -->

## [<img src="https://seleniumbase.github.io/img/logo6.png" title="SeleniumBase" width="32">](https://github.com/seleniumbase/SeleniumBase/) 🐝 Behave test runner for SeleniumBase 🐝

🐝 (Utilizes the [Behave BDD Python library](https://github.com/behave/behave). For more info, see the [Behave tutorial](https://behave.readthedocs.io/en/stable/tutorial.html) and read about [Behave's Gherkin model](https://behave.readthedocs.io/en/stable/gherkin.html).)

🐝 Behave examples with SeleniumBase: [SeleniumBase/examples/behave_bdd](https://github.com/seleniumbase/SeleniumBase/blob/master/examples/behave_bdd)

```bash
> behave features/login_logout.feature -T -D dashboard -k

*********************************************************************
Feature: Login and Logout # features/login_logout.feature:2

  Background:   # features/login_logout.feature:4

  Scenario: User can log in and log out successfully  # features/login_logout.feature:7
    Given Open PermaplanT Homepage                    # features/steps/home_page.py:4
    When Login to PermaplanT with Adi and 1234        # features/steps/home_page.py:12
    Then Verify that the current user is logged in    # features/steps/home_page.py:21
    When Logout from PermaplanT                       # features/steps/home_page.py:28
    Then Verify on Homepage and logged out            # features/steps/home_page.py:34
   ✅ Scenario Passed!

==================================================================================
1 feature passed, 0 failed, 0 skipped
1 scenario passed, 0 failed, 0 skipped
5 steps passed, 0 failed, 0 skipped, 0 undefined
Took 0m4.682s
```

🐝⚪ With the Dashboard enabled, you'll get one of these:

<img src="https://seleniumbase.github.io/cdn/img/sb_behave_dashboard.png" title="SeleniumBase" width="600">

### 🐝 Behave-Gherkin files:

🐝 The `*.feature` files can use any step seen from:

```bash
behave --steps-catalog
```

🐝🎖️ For convenience, the [SeleniumBase Behave GUI](https://github.com/seleniumbase/SeleniumBase/blob/master/help_docs/behave_gui.md) lets you run `behave` scripts from a Desktop app.

🐝🎖️ To launch it, call `sbase behave-gui` or `sbase gui-behave`:

```bash
sbase behave-gui
* Starting the SeleniumBase Behave Commander GUI App...
```

<img src="https://seleniumbase.github.io/cdn/img/sbase_behave_gui_wide_5.png" title="SeleniumBase" width="600">

🐝🎖️ You can customize the tests that show up there:

```bash
sbase behave-gui  # all tests
sbase behave-gui features/login_logout.feature  # tests in that feature
```

---

<div>To learn more about SeleniumBase, check out the Docs Site:</div>
<a href="https://seleniumbase.io">
<img src="https://img.shields.io/badge/docs-%20%20SeleniumBase.io-11BBDD.svg" alt="SeleniumBase.io Docs" /></a>

<div>All the code is on GitHub:</div>
<a href="https://github.com/seleniumbase/SeleniumBase">
<img src="https://img.shields.io/badge/✅%20💛%20View%20Code-on%20GitHub%20🌎%20🚀-02A79E.svg" alt="SeleniumBase on GitHub" /></a>
