import { Patient } from "./Patient";

export interface Meeting {
  schedule: string | Date;
  patient: string;
  psychologist: string;
  quantity: number;
  frequency: number;
  amount: number;
}

export interface MeetingData {
  _patient: Patient;
  _status: string;
  _documents: [
    {
      _title: string,
      _docLink: string,
    }
  ];
  _schedule: string | Date;
  _bill: {
    _id: {
      _id: string
    },
    _paymentMethod:{
      _paymentDate: Date,
      _paymentType: string
    },
    _amount: number,
    _dueDate: string,
    _title: string,
    _billType: string
  };
}
