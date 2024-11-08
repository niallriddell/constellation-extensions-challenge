 
import type { DataResponse } from '@pega/pcore-pconnect-typedefs/data-view/types';

const ratingData: Omit<DataResponse, 'config'> = {
  data: {
    fetchDateTime: '2023-01-18T12:04:56.517Z',
    data: [
      {
        CustomerRating: 3,
        NumberOfStars: 5,
        CaseID: 'SL-TELLUSMORE-WORK Z-1234',
        CaseClassName: 'SL-TellUsMore-Work-Incident',
        CustomerID: 'Q1234',
        pyGUID: '6876786876876868123',
        pxUpdateDateTime: '2020-06-29T11:06:24.329Z'
      },
      {
        CustomerRating: 3,
        NumberOfStars: 5,
        CaseID: 'SL-TELLUSMORE-WORK Z-123',
        CaseClassName: 'SL-TellUsMore-Work-Incident',
        CustomerID: 'Q1234',
        pyGUID: '68767868768768681',
        pxUpdateDateTime: '2020-06-29T11:06:24.329Z'
      },
      {
        CustomerRating: 2,
        NumberOfStars: 5,
        CaseID: 'SL-TELLUSMORE-WORK Z-124',
        CaseClassName: 'SL-TellUsMore-Work-Incident',
        CustomerID: 'Q1234',
        pyGUID: '68767868768768682',
        pxUpdateDateTime: '2020-06-29T11:06:24.329Z'
      },
      {
        CustomerRating: 1,
        NumberOfStars: 5,
        CaseID: 'SL-TELLUSMORE-WORK Z-125',
        CaseClassName: 'SL-TellUsMore-Work-Incident',
        CustomerID: 'Q1234',
        pyGUID: '68767868768768654',
        pxUpdateDateTime: '2020-06-29T11:06:24.329Z'
      },
      {
        CustomerRating: 4,
        NumberOfStars: 5,
        CaseID: 'SL-TELLUSMORE-WORK Z-126',
        CaseClassName: 'SL-TellUsMore-Work-Incident',
        CustomerID: 'Q123',
        pyGUID: '68767868768768639',
        pxUpdateDateTime: '2020-06-29T11:06:24.329Z'
      },
      {
        CustomerRating: 4,
        NumberOfStars: 5,
        CaseID: 'SL-TELLUSMORE-WORK Z-127',
        CaseClassName: 'SL-TellUsMore-Work-Incident',
        CustomerID: 'Q123',
        pyGUID: '687678687687686391',
        pxUpdateDateTime: '2020-06-29T11:06:24.329Z'
      },
      {
        CustomerRating: 4,
        NumberOfStars: 5,
        CaseID: 'SL-TELLUSMORE-WORK Z-128',
        CaseClassName: 'SL-TellUsMore-Work-Incident',
        CustomerID: 'Q123',
        pyGUID: '687678687687686392',
        pxUpdateDateTime: '2020-06-29T11:06:24.329Z'
      },
      {
        CustomerRating: 4,
        NumberOfStars: 5,
        CaseID: 'SL-TELLUSMORE-WORK Z-129',
        CaseClassName: 'SL-TellUsMore-Work-Incident',
        CustomerID: 'Q123',
        pyGUID: '687678687687686393',
        pxUpdateDateTime: '2020-06-29T11:06:24.329Z'
      }
    ]
  },
  status: 200,
  statusText: '',
  headers: {
    'content-length': '1328',
    'content-type': 'application/json;charset=UTF-8'
  },
  request: {}
};

export default ratingData;
