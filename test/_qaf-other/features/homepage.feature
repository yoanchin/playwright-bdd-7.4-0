Feature: Playwright Home Page

  Scenario Outline: Check title
    Given I am on Playwright home page
    When I click link "<link>"
    Then I see in title "<title>"
    Then Test DataTable
    |row1_value1|row1_value2|row1_value3|row1_value4|row1_value5|
    |row2_value1|row2_value2|row2_value3|row2_value4|row2_value5|
    |row3_value1|row3_value2|row3_value3|row3_value4|row3_value5|
    |row4_value1|row4_value2|row4_value3|row4_value4|row4_value5|
    
    Examples:{'datafile':'testdata/testdata1.json'}
