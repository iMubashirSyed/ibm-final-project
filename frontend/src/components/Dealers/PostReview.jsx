import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../Header/Header';
import './Dealers.css';
import '../assets/style.css';

const PostReview = () => {
  const [dealer, setDealer] = useState({});
  const [review, setReview] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [date, setDate] = useState('');
  const [carmodels, setCarmodels] = useState([]);

  const { id } = useParams();

  const root_url = window.location.href.split('postreview')[0];
  const dealer_url = `${root_url}djangoapp/dealer/${id}`;
  const review_url = `${root_url}djangoapp/add_review`;
  const carmodels_url = `${root_url}djangoapp/get_cars`;

  useEffect(() => {
    get_dealer();
    get_cars();
  }, []);

  const get_dealer = async () => {
    const res = await fetch(dealer_url);
    const retobj = await res.json();
    if (retobj.status === 200 && retobj.dealer?.length > 0) {
      setDealer(retobj.dealer[0]);
    }
  };

  const get_cars = async () => {
    const res = await fetch(carmodels_url);
    const retobj = await res.json();
    setCarmodels(retobj.CarModels || []);
  };

  const postreview = async () => {
    let name = sessionStorage.getItem('firstname') + ' ' + sessionStorage.getItem('lastname');
    if (name.includes('null')) {
      name = sessionStorage.getItem('username');
    }

    if (!model || !review || !date || !year) {
      alert('All details are mandatory');
      return;
    }

    const [make_chosen, ...model_parts] = model.split(' ');
    const model_chosen = model_parts.join(' ');

    const jsoninput = JSON.stringify({
      name,
      dealership: id,
      review,
      purchase: true,
      purchase_date: date,
      car_make: make_chosen,
      car_model: model_chosen,
      car_year: year,
    });

    const res = await fetch(review_url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: jsoninput,
    });

    const json = await res.json();
    if (json.status === 200) {
      window.location.href = `${window.location.origin}/dealer/${id}`;
    }
  };

  return (
    <div>
      <Header />
      <div className="max-w-3xl mx-auto mt-10 bg-white shadow-md p-8 rounded-lg">
        <h1 className="text-2xl font-bold text-blue-900 mb-6 text-center">
          Post a Review for {dealer.full_name || 'Dealer'}
        </h1>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Your Review</label>
          <textarea
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:border-blue-400"
            rows="5"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Write your review here..."
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Purchase Date</label>
          <input
            type="date"
            className="w-full border border-gray-300 rounded-md p-2"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Car Make & Model</label>
          <select
            className="w-full border border-gray-300 rounded-md p-2"
            onChange={(e) => setModel(e.target.value)}
            defaultValue=""
          >
            <option value="" disabled>Choose Car Make and Model</option>
            {carmodels.map((carmodel, index) => (
              <option key={index} value={`${carmodel.CarMake} ${carmodel.CarModel}`}>
                {carmodel.CarMake} {carmodel.CarModel}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Car Year</label>
          <input
            type="number"
            min="2015"
            max="2023"
            className="w-full border border-gray-300 rounded-md p-2"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
        </div>

        <button
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          onClick={postreview}
          disabled={!model || !review || !date || !year}
        >
          Post Review
        </button>
      </div>
    </div>
  );
};

export default PostReview;
