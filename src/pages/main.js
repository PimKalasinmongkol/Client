import '../style.css';
import { FaCircleUser } from "react-icons/fa6";
import { TiDelete } from "react-icons/ti";
import React, {useState ,useEffect} from 'react';

const Main = () => {
  const [announceText ,setAnnounceText] = useState('')
  const [announceTextData ,setAnnounceTextData] = useState([])
  async function handleAddAnnounce() {
    await fetch('http://localhost:4000/admin/createAnnouncement',{
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        announce_text: announceText
      })
    })
  }
  async function handleDeleteAnnouncement(id) {
    try {
      (await fetch(`http://localhost:4000/admin/deleteAnnouncement/${id}`))
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    (async function() {
      const res = await fetch('http://localhost:4000/admin/getAnnouncement')
      const data = await res.json()
      setAnnounceTextData(data)
    })()
  }, [announceTextData])
  return (
    <div className='ml-24'>
      <div className='mx-5 my-5 flex flex-col justify-start text-black font-bold '>
        <p className='text-3xl '>ยินดีต้อนรับเข้าสู่ระบบ</p>
        <div className='flex flex-row p-6 items-center'>
          <FaCircleUser size={60} />
          <p className='pl-6 text-rose-color text-2xl '>คุณสมศรี สนุกซุกซน</p>
        </div>
        <div className='flex flex-row p-1 text-lg justify-center'>
          <p className=''>ประกาศเพิ่มเติม</p>
        </div>

        <div className='flex flex-row justify-center my-5'>
          <div className='flex flex-col bg-from-color rounded-lg  p-5 mx-10 w-9/12 justify-start '>
          {
            announceTextData.length > 0 ?
            announceTextData.map((item) => (
              <div className='flex flex-col justify-center'>
                <div className='flex justify-end'>
                  <button  onClick={() => handleDeleteAnnouncement(item.announce_id)} className='rounded hover:bg-neutral-50 active:bg-neutral-800 justify-self-end '>
                  <TiDelete size={30} color='#7A1E1E'/>
                </button>
                </div>
                
                <div className='flex w-full justify-center'><p className='text-center text-base'>{item.announce_text}</p></div>
                
              </div>
            ))
            :
            (<div className='flex flex-row justify-center text-xl'>ไม่มีประกาศขณะนี้</div>)
          }
          </div>
        </div>
      <div className='underline-text'>
      </div>
        <form className='flex flex-row justify-center my-5' onSubmit={handleAddAnnounce}>
          <div className='flex flex-col bg-from-color rounded-lg  p-5 mx-10 w-9/12 justify-start '>
            <textarea rows="5" cols="10" className='p-3' onChange={(event) => setAnnounceText(event.target.value)}></textarea>
            <div className='flex flex-row justify-end'>
              <button type='submit' className='bg-name-color rounded hover:bg-rose-800 active:bg-neutral-800 justify-self-end p-2 text-white'>
                ยืนยัน
              </button>
            </div>
          </div>
        </form>
      </div>
      <p></p>
    </div>
  );
};

export default Main;