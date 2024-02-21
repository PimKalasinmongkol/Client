import '../style.css';
import { FaCircleUser } from "react-icons/fa6";

const Home = () => {
  return (
    <div className='ml-24'>
      <div className='mx-5 my-5 flex flex-col justify-start text-black font-bold '>
        <p className='text-3xl '>ข้อมูลบัญชี</p>

        <div className='flex flex-row p-1 text-lg justify-center'>
          <p className=''></p>
        </div>

        <div className='flex flex-row justify-center my-20'>
          <div className='flex flex-col bg-from-color rounded-lg  p-5 mx-12 w-8/12 justify-center '>
            <div className='flex flex-row justify-start'>
              <div className='flex flex-row p-6 items-center'>
                <FaCircleUser size={80} />
              
                <div className='flex flex-col p-6 justify-start'>
                  <p className='flex pl-3 pb-2 text-rose-color text-2xl '>ชื่อ-นามสกุล : <p>คุณสมศรี สนุกซุกซน</p></p>
                  <p className='flex pl-3 pt-2 text-rose-color text-2xl '>สถานะ : <p>อาจารย์</p></p>
                </div>
            </div>
            <div>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div> // เพิ่ม tag </div> เพื่อปิด div ที่เปิดไว้ตั้งแต่ต้น
  );
};

export default Home;