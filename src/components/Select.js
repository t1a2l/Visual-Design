import React, { Component } from "react";
import axios from "axios";
import "./Select.css";

class Select extends Component {
  constructor(props) {
    super(props);
    this.state = {
      json_arr: [],
      customers: [],
      countrySelectIndex: 0,
      citySelectIndex: 0,
      defaultCountryValue: "",
      defaultCityValue: "",
      defaultCompanyValue: "",
      checkFirstUpdate: false
    };
  }

  componentDidMount() {
    this.loadJson();
  }

  loadJson = e => {
    axios.get("clients.json").then(res => {
      this.setState({
        json_arr: res.data.Customers
      });
      this.showjson();
    });
  };

  showjson = e => {
    let countriesArr = [];
    let index = 0,
      countryIndex = 0,
      cityIndex = 0,
      countryId = 0,
      cityId = 100;
    while (index < this.state.json_arr.length) {
      let companyId = this.state.json_arr[index].Id;
      let companyAddress = this.state.json_arr[index].Address;
      let country = this.state.json_arr[index].Country;
      let city = this.state.json_arr[index].City;
      let company = this.state.json_arr[index].CompanyName;
      countryIndex = countriesArr.findIndex(i => i.name === country);
      if (countryIndex === -1) {
        countriesArr.push({
          id: countryId,
          name: country,
          citiesArr: [
            {
              id: cityId,
              name: city,
              companiesArr: [
                {
                  id: companyId,
                  name: company,
                  address: companyAddress
                }
              ]
            }
          ]
        });
        countryId++;
        cityId++;
      } else {
        cityIndex = countriesArr[countryIndex].citiesArr.findIndex(
          i => i.name === city
        );
        if (cityIndex === -1) {
          countriesArr[countryIndex].citiesArr.push({
            id: cityId,
            name: city,
            companiesArr: [
              {
                id: companyId,
                name: company,
                address: companyAddress
              }
            ]
          });
          cityId++;
        } else {
          countriesArr[countryIndex].citiesArr[cityIndex].companiesArr.push({
            id: companyId,
            name: company,
            address: companyAddress
          });
        }
      }
      index++;
    }
    countriesArr.sort(function(a, b) {
      return b.citiesArr.length - a.citiesArr.length;
    });
    for (let i = 0; i < countriesArr.length; i++) {
      let cityArr = countriesArr[i].citiesArr;
      cityArr.sort(function(a, b) {
        return b.companiesArr.length - a.companiesArr.length;
      });
      for (let j = 0; j < cityArr.length; j++) {
        let companyArr = countriesArr[i].citiesArr[j].companiesArr;
        companyArr.sort(function(a, b) {
          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }
          return 0;
        });
      }
    }

    this.setState({
      customers: countriesArr
    });
  };

  changeCountry = (e, country) => {
    if (!country) country = e.target.value;
    let i = this.state.customers.findIndex(i => i.name === country);
    this.setState(
      {
        citySelectIndex: 0,
        countrySelectIndex: i,
        defaultCountryValue: country,
        defaultCityValue: this.state.customers[i].citiesArr[0].name
      },
      () => {
        this.changeCity("", this.state.defaultCityValue);
      }
    );
  };

  changeCity = (e, city) => {
    if (!city) city = e.target.value;
    let i = this.state.customers[
      this.state.countrySelectIndex
    ].citiesArr.findIndex(i => i.name === city);
    this.setState(
      {
        citySelectIndex: i,
        defaultCityValue: city,
        defaultCompanyValue: this.state.customers[this.state.countrySelectIndex]
          .citiesArr[i].companiesArr[0].name
      },
      () => {
        this.changeCompany("", this.state.defaultCompanyValue);
      }
    );
  };

  changeCompany = (e, company) => {
    if (!company) company = e.target.value;
    let i = this.state.customers[this.state.countrySelectIndex].citiesArr[
      this.state.citySelectIndex
    ].companiesArr.findIndex(i => i.name === company);
    this.setState({
      defaultCompanyValue: company
    });
    let companyObject = this.state.customers[this.state.countrySelectIndex]
      .citiesArr[this.state.citySelectIndex].companiesArr[i];
    this.props.getAddress(companyObject, this.state.defaultCityValue);
  };

  componentDidUpdate(prevProps) {
    if (this.state.customers.length > 0 && !this.state.checkFirstUpdate) {
      this.changeCountry("", this.state.customers[0].name);
      this.setState({
        checkFirstUpdate: true
      });
    }
  }

  render() {
    let customers = this.state.customers;
    let optionCountries = "",
      optionCities = "",
      optionComapnies = "";
    if (customers.length > 0) {
      optionCountries = customers.map(country => (
        <option className="optionStyle" key={country.id}>
          {country.name}
        </option>
      ));
      optionCities = customers[this.state.countrySelectIndex].citiesArr.map(
        city => (
          <option className="optionStyle" key={city.id}>
            {city.name}
          </option>
        )
      );
      optionComapnies = customers[this.state.countrySelectIndex].citiesArr[
        this.state.citySelectIndex
      ].companiesArr.map(company => (
        <option className="optionStyle" key={company.id}>
          {company.name}
        </option>
      ));
    }

    return (
      <div className="selectStyle">
        <div className="grp">
          <label className="labelStyle">Countries</label>
          <select
            size="5"
            value={this.state.defaultCountryValue}
            className="countrySelectStyle"
            onChange={this.changeCountry.bind(this)}
          >
            {optionCountries}
          </select>
        </div>
        <div className="grp">
          <label className="labelStyle">Cities</label>
          <select
            value={this.state.defaultCityValue}
            size="5"
            className="citySelectStyle"
            onChange={this.changeCity.bind(this)}
          >
            {optionCities}
          </select>
        </div>
        <div className="grp">
          <label className="labelStyle">Company</label>
          <select
            value={this.state.defaultCompanyValue}
            size="5"
            className="companySelectStyle"
            onChange={this.changeCompany.bind(this)}
          >
            {optionComapnies}
          </select>
        </div>
      </div>
    );
  }
}

export default Select;
