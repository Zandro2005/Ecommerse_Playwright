# Manual Test Cases (SauceDemo)

This document outlines the manual test cases designed for the SauceDemo application.

> **Note:** The `README.md` mentions a total of 87 cases. Below is a structural template to help document these cases. The cases that are automated in this Playwright suite are marked accordingly.

## Authentication Tests

| Test Case ID    | Scenario          | Pre-conditions        | Test Steps                                                              | Expected Result                                                      | Status       |
| :-------------- | :---------------- | :-------------------- | :---------------------------------------------------------------------- | :------------------------------------------------------------------- | :----------- |
| **TC-AUTH-001** | Valid login       | User is on login page | 1. Enter `standard_user`<br>2. Enter valid password<br>3. Click login   | User is redirected to Products page                                  | ✅ Automated |
| **TC-AUTH-002** | Locked out user   | User is on login page | 1. Enter `locked_out_user`<br>2. Enter valid password<br>3. Click login | Error message: "Epic sadface: Sorry, this user has been locked out." | ✅ Automated |
| **TC-AUTH-003** | Empty credentials | User is on login page | 1. Leave fields empty<br>2. Click login                                 | Error message about required fields                                  | ✅ Automated |
| **TC-AUTH-004** | Logout            | User is logged in     | 1. Open hamburger menu<br>2. Click Logout                               | User is redirected back to login page                                | ✅ Automated |
| **TC-AUTH-005** | Session access    | User is not logged in | 1. Attempt to navigate directly to `/inventory.html`                    | User is blocked and redirected to login page                         | ✅ Automated |

## Products & Sorting Tests

| Test Case ID    | Scenario                  | Pre-conditions           | Test Steps                      | Expected Result                                                        | Status       |
| :-------------- | :------------------------ | :----------------------- | :------------------------------ | :--------------------------------------------------------------------- | :----------- |
| **TC-PROD-001** | Verify product listing    | User is logged in        | 1. Navigate to Products page    | All 6 standard products are visible with title, description, and price | ✅ Automated |
| **TC-PROD-002** | Sort: Name (A to Z)       | User is on Products page | 1. Select "Name (A to Z)"       | Products sorted alphabetically                                         | ✅ Automated |
| **TC-PROD-003** | Sort: Price (High to Low) | User is on Products page | 1. Select "Price (high to low)" | Products sorted by price descending                                    | ✅ Automated |

## Shopping Cart Tests

| Test Case ID    | Scenario               | Pre-conditions           | Test Steps                               | Expected Result                                     | Status       |
| :-------------- | :--------------------- | :----------------------- | :--------------------------------------- | :-------------------------------------------------- | :----------- |
| **TC-CART-001** | Add item from Products | User is on Products page | 1. Click "Add to cart" on a product      | Cart badge updates to 1, button changes to "Remove" | ✅ Automated |
| **TC-CART-002** | Remove item from Cart  | User has 1 item in cart  | 1. Navigate to Cart<br>2. Click "Remove" | Item disappears, cart badge updates                 | ✅ Automated |

## Checkout Tests

| Test Case ID   | Scenario                | Pre-conditions          | Test Steps                                                                | Expected Result                                 | Status       |
| :------------- | :---------------------- | :---------------------- | :------------------------------------------------------------------------ | :---------------------------------------------- | :----------- |
| **TC-CHK-001** | Successful checkout     | Cart has items          | 1. Click Checkout<br>2. Fill info<br>3. Click Continue<br>4. Click Finish | Success message: "Thank you for your order!"    | ✅ Automated |
| **TC-CHK-002** | Total price calculation | Cart has multiple items | 1. Proceed to Checkout Step 2                                             | Item total + Tax exactly equals the Final Total | ✅ Automated |

_(Continue documenting the remaining manual test cases here...)_
