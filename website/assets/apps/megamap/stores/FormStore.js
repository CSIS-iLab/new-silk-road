import alt from '../alt';

class FormStore {
  constructor() {
    this.resetValues();
    this.options = Object.assign({}, {
      infrastructure_type: [],
      status: [],
      region: [],
      funding__sources__countries: [],
      countries: [],
    })
  }

  resetValues() {
    this.values = FormStore.defaultValues();
  }

  static defaultValues() {
    return Object.assign({}, {
      name__icontains: '',
      initiatives__name__icontains: '',
      funding__sources__name__icontains: '',
      initiatives__principal_agent__slug: '',
      date_range: {},
      infrastructure_type: [],
      status: [],
      region: [],
      funding__sources__countries: [],
      countries: [],
    });
  }
}

export default alt.create(FormStore, 'FormStore');
