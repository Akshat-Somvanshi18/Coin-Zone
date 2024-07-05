import React , {useState,useEffect} from 'react'
import {Button, Menu, Typography, Avatar} from "antd";
import { Link } from "react-router-dom";
import {HomeOutlined, MoneyCollectOutlined, BulbOutlined, FundOutlined, MenuOutlined} from "@ant-design/icons";
import icon from "../images/cryptocurrency.png";
import {auth, googleProvider} from "../config/firebase";
import { signInWithPopup } from 'firebase/auth';
import { useNavigate } from "react-router-dom";

const Navbar = (props) => {
  const [activeMenu,setActiveMenu] = useState(true);

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider).then((data)=>{
        localStorage.setItem("email",data.user.email);
        localStorage.setItem("isAuth",true);
        props.setIsAuth(true);
        navigate("/");
      })
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  const handleLogout = async() => {
    await auth.signOut().then(()=>{
        localStorage.clear();
        props.setIsAuth(false);
        navigate("/")
    })
  };


  return (
    <div className='nav-container'>
        <div className='logo-container'>
            <Avatar src={icon} size='large'/>
            <Typography.Title level={2} className='logo'>
                <Link to="/">Coin Zone</Link>
            </Typography.Title>
            <Button className='menu-control-container' onClick={()=>setActiveMenu(!activeMenu)}/>
        </div>
        {activeMenu && (
          <Menu theme='dark'>
          <Menu.Item icon={<HomeOutlined/>}>
            <Link to="/">Home</Link>
          </Menu.Item>
          <Menu.Item icon={<FundOutlined/>}>
            <Link to="/cryptocurrencies">Cryptocurrencies</Link>
          </Menu.Item>
          <Menu.Item icon={<MoneyCollectOutlined/>}>
            <Link to="/exchanges">Exchanges</Link>
          </Menu.Item>
          <Menu.Item icon={<BulbOutlined/>}>
            <Link to="/news">News</Link>
          </Menu.Item>
          
          {props.isAuth && (<Menu.Item icon={<BulbOutlined/>}><Link to="/userpanel">User Panel</Link></Menu.Item>) }
          
          <Menu.Item icon={<BulbOutlined/>}>
          {props.isAuth ? (<a onClick={handleLogout}>Logout</a>) : (<a onClick={handleLogin}>Login</a>)}
          </Menu.Item>
       </Menu>
          
        )}
        
    </div>
  )
}

export default Navbar