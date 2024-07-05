import React,{useState,useEffect} from 'react'
import axios from 'axios'
import {Select, Avatar, Typography, Row, Col, Card} from "antd";
import moment from 'moment';
import { useGetCryptosQuery } from '../services/cryptoApi';
import Loader from './Loader';

const {Text, Title} = Typography;
const {Option} = Select;
const demoImage = "https://editorial.fxstreet.com/miscelaneous/cryptos-645x362_Original.jpg";
const News = ({simplified}) => {

  const [cryptoNews, setCryptoNews] = useState([]);
  const [newsCategory, setNewsCategory] = useState("cryptocurrency")
  const [isLoading,setIsLoading] = useState(false);
  const count = simplified ? 9 : 30; 
  const {data,isFetching} = useGetCryptosQuery(50);
  // const allCoins = data?.data?.coins;
  console.log("my coins")
  console.log(data)

  const fetchData=async()=>{
    setIsLoading(true);
    let url=`https://newsapi.org/v2/everything?q=${newsCategory}?&apiKey=3f85b625c3404c89ba67c2fba8087ea8`;
    let data=await fetch(url);
    let parsedData = await data.json();
    console.log(parsedData)
    let filteredData = parsedData?.articles.filter((element,index)=>index<count);
    setCryptoNews(filteredData);
    setIsLoading(false)
    // console.log("newss")
    // console.log(cryptoNews);
    
  }

  useEffect(() => {
    console.log("inside");
       fetchData();
  }, []);

  if(isLoading) return <Loader/>;


  // console.log("newss")
  // console.log(cryptoNews)
  // if(isLoading) return "Loading news";
  // console.log(newsCategory)

  
  return (
    <Row gutter={[24,24]}>
      {/* {!simplified && (
        <Col span={24}>
          <Select showSearch className='select-news' placeholder="select a crypto" optionFilterProp='children' onChange={(value)=>setNewsCategory(value)}
          filterOption={(input,option)=>option.children.toLowerCase().indexOf(input.toLowerCase())}>
            <Option value="cryptocurrency">Cryptocurrency</Option>
            {allCoins.map((coin)=><Option value={coin.name}>{coin.name}</Option>)}
          </Select>
        </Col>
      )} */}
      {cryptoNews.map((news,index)=>(
        <Col xs={24} sm={12} lg={8} key={index}>
          <Card hoverable className='news-card'>
            <a href={news?.url} target='_blank' rel="noreferrer">
              <div className='news-image-container'>
                <Title className='news-title' level={4}>{news.content.length > 50 ? `${news.content.substring(0,50)}` : news.content}</Title>
                <img src={news?.urlToImage || demoImage} alt='news' className='news-image' style={{maxWidth: "100px" , maxHeight: "100px"}}/>
              </div>
              <p>{news.description.length > 170 ? `${news.description.substring(0,170)}...` : news.description}</p>
              <div className='provider-container'>
                <div>
                  <Avatar src={news.urlToImage || demoImage} alt='news'/>
                  <Text className='provider-name'>{news?.source?.name}</Text>
                </div>
                <Text>{moment(news.publishedAt).startOf('ss').fromNow()}</Text>
              </div>
            </a>
          </Card>
        </Col>
      ))}

    </Row>

    
  )
}

export default News