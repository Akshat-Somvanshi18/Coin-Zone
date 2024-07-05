import React, { useState, useEffect } from "react";
import { Row, Col, Typography } from "antd";
import { Select, InputNumber, Button, Card } from "antd";
import { useGetCryptosQuery } from "../services/cryptoApi";
import Loader from "./Loader";
import { db } from "../config/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { query, orderBy, onSnapshot,where } from "firebase/firestore";
import { doc, deleteDoc} from "firebase/firestore";


import millify from "millify";

const { Title } = Typography;
const UserPanel = (props) => {
  const { data, isFetching } = useGetCryptosQuery(100);
  const [coin, setCoin] = useState("");
  const [value, setValue] = useState(0);
  const [amount, setAmount] = useState(0);
  const [userData, setUserData] = useState();
  
  useEffect(() => {
    const q = query(collection(db, "user-investment"), where ("username","==",localStorage.getItem("email")));
    onSnapshot(q, (querySnapshot) => {
      setUserData(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      );
    });
  }, []);

  console.log(userData);

  const coinList = data?.data?.coins;
  const options = [];
  
  if (isFetching) return <Loader />;

  for (let i = 0; i < coinList.length; i++) {
    const choice = { value: coinList[i].name, label: coinList[i].name };
    options.push(choice);
  }

  const onChange = (value) => {
    setCoin(value);
  };

  const onSearch = (value) => {
    console.log("search:", value);
  };
  const onChangeValue = (value) => {
    setValue(value);
  };

  const onChangeAmount = (value) => {
    setAmount(value);
  };

  const handleSave = async (e) => {
    try {
      await addDoc(collection(db, "user-investment"), {
        username: localStorage.getItem("email"),
        coin: coin,
        boughtAt: value,
        investedAmount: amount,
        created: Timestamp.now(),
      });
    } catch (err) {
      alert(err);
    }
  };

  const getCurrentRate = (coinname) => {
    var currPrice = 0;
    for (let i = 0; i < coinList.length; i++) {
      if (coinList[i].name === coinname) {
        currPrice = coinList[i].price;
        break;
      }
    }
    return currPrice;
  };

  const calculateProfit = (investedAmount, boughtAt, coinname) => {
    console.log("i am inside the function");
    let coinsBought = (1 / boughtAt) * investedAmount;
    var currPrice = getCurrentRate(coinname);
 
    var returns = coinsBought * currPrice - investedAmount;
    return returns;
  };

  const handleDelete = async (id) => {
    console.log("delete function")
    console.log(id);
    const taskDocRef = doc(db, 'user-investment', id);
    try{
      await deleteDoc(taskDocRef)
    } catch (err) {
      alert(err)
    }
  }

  return (
    <>
    {props.isAuth ?
    <div>
      <Row>
        <Col span={12}>
          <Title level={3} className="heading">
            Hey there
          </Title>
        </Col>
        <Col span={12} style={{textAlign:"end"}}>
          <Title level={3} className="heading">
            {localStorage.getItem("email")}
          </Title>
        </Col>
      </Row>
      <hr></hr>
      <Title level={2} className='heading' style={{marginTop:"40px"}}>Welcome to the Profit Calculation section! This feature is designed to help you track the performance of your cryptocurrency investments.</Title>
      <Title level={5} className='heading' style={{marginTop:"40px"}}>Coin Name: Enter the name of the cryptocurrency you have invested in. For example, Bitcoin (BTC), Ethereum (ETH), etc.<br></br>
Bought At Amount: Provide the price at which you purchased the cryptocurrency. This is the price per coin at the time of your investment.<br></br>
Invested Amount: Enter the total amount of money you invested in the cryptocurrency.
</Title>
      <Row justify="start" style={{marginTop:"50px"}}>
        <Col span={2} style={{marginRight:"30px"}}>
          <Select
            showSearch
            placeholder="Select a coin"
            optionFilterProp="label"
            onChange={onChange}
            onSearch={onSearch}
            options={options}
            style={{width:"120px"}}
            
          />
        </Col>
        <Col span={2}>
          <InputNumber min={0} placeholder="Bought At" onChange={onChangeValue} />
        </Col>
        <Col span={2}>
          <InputNumber min={0}  placeholder="invested amount" onChange={onChangeAmount} />
        </Col>
        <Col span={2}>
          <Button type="primary" onClick={handleSave}>
            Save
          </Button>
        </Col>
      </Row>
      <Title level={2} className='heading' style={{marginTop:"40px"}}>Your Invested Currencies</Title>
      <hr></hr>
      <Title level={4} className='heading' style={{marginTop:"40px"}}>In the Investment Overview section, you can easily track all your cryptocurrency investments at a glance. Each investment is displayed in the form of a card, providing a clear and concise summary of key information.</Title>
      <Title level={5} className='heading'>Coin Name: The name of the cryptocurrency you have invested in.<br></br>
Bought At Amount: The price per coin at the time of your purchase.<br></br>
Invested Amount: The total amount of money you invested in the cryptocurrency.<br></br>
Current Value: The current market value of your investment.<br></br>
Net Profit/Loss: The difference between your invested amount and the current value, showing you how much profit or loss you have made.</Title>
      <Row gutter={[32, 32]} className="investment-card-container" style={{marginTop:"20px"}} justify="start">
        {userData?.map((element,index) => (
          <Col
            xs={24}
            sm={12}
            lg={6}
            className="investment-card"
            key={element.id}
          >
            <Card title={`${index+1}) ${element.data.coin}`} extra={<Button type="default" onClick={()=>handleDelete(element.id)} danger>Delete</Button>} hoverable>
              <p>Bought At : ${millify(element.data.boughtAt)}</p>
              <p>Invested Amount : ${millify(element.data.investedAmount)}</p>
              <p>Current Rate : ${millify(getCurrentRate(element.data.coin))}</p>
              <p>
                Current Return : $
                {millify(
                  calculateProfit(
                    element.data.investedAmount,
                    element.data.boughtAt,
                    element.data.coin
                  )
                )}
              </p>
            </Card>
          </Col>
        ))}
      </Row>
      </div> : <div><Title level={2} style={{height:"100vh"}}>Login to access this panel.<hr></hr></Title></div>
}
    </>
  );
};

export default UserPanel;
