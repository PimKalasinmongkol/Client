import React, { useState, useEffect } from "react";
import * as XLXS from 'xlsx';

const Addroom = () => {
    const [data,setData] = useState([])
    const [room_number, setRoom_number] = useState("");
    const [room_seat, setRoom_seat] = useState(0);
    const [courseData ,setCourseData] = useState([]);
    const [filteredCourseData, setFilteredCourseData] = useState([]); 
    const [filterValue, setFilterValue] = useState(""); 
    const [selectedItems_open, setSelectedItems_open] = useState({});
    const [selectedItems_delete, setSelectedItems_delete] = useState({});
    const [buttonText_open,setButtonText_open] = useState("เลือกทั้งหมด")
    const [buttonText_delete,setButtonText_delete] = useState("เลือกทั้งหมด")
  
    ////////////////////open/////////////////////
  const handleCheckboxChange_open = (id) => {
    setSelectedItems_open({
      ...selectedItems_open,
      [id]: !selectedItems_open[id]
    });
  };
  
  const handleCheckAll_open = () => {
    const allSelected_open = {}; // Object to store selected state for all items
    const allSelected = Object.values(selectedItems_open).every(value => value); // Check if all items are currently selected
  
    // If all items are currently selected, deselect all; otherwise, select all
    filteredCourseData.forEach(item => {
      allSelected_open[item.room_number] = !allSelected;
    });
  
    // Update selectedItems_open state with allSelected_open
    setSelectedItems_open(allSelected_open);

    if (allSelected) {
      setButtonText_open("เลือกทั้งหมด");
    } else {
      setButtonText_open("ยกเลิกทั้งหมด");
    }
  };

  ///////////////////delete/////////////////
  const handleCheckboxChange_delete = (id) => {
    setSelectedItems_delete({
      ...selectedItems_delete,
      [id]: !selectedItems_delete[id]
    });
  };
  
  const handleCheckAll_delete = () => {
    const allSelected_delete = {}; // Object to store selected state for all items
    const allSelected = Object.values(selectedItems_delete).every(value => value); // Check if all items are currently selected
  
    // If all items are currently selected, deselect all; otherwise, select all
    filteredCourseData.forEach(item => {
      allSelected_delete[item.room_number] = !allSelected;
    });
  
    // Update selectedItems_delete state with allSelected_delete
    setSelectedItems_delete(allSelected_delete);

    if (allSelected) {
      setButtonText_delete("เลือกทั้งหมด");
    } else {
      setButtonText_delete("ยกเลิกทั้งหมด");
    }
  };

    async function handleImportroom() {
        try {
            await fetch("http://localhost:4000/room/importRoom", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    room_number: room_number,
                    room_seat: room_seat,
                }),
            });
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        (async function() {
            const res = await fetch("http://localhost:4000/room/getAllRoom");
            const data = await res.json();
            setCourseData(data);
        })();
    }, []);
    

    const handleFileUpload = (e) => {
        setData([]);
        const reader = new FileReader();
        reader.readAsArrayBuffer(e.target.files[0])
        
        reader.onload = (e) => {
          const data = e.target.result;
          const workbook = XLXS.read(data,{type : "binary"});
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const parsedData = XLXS.utils.sheet_to_json(sheet);
          setData(parsedData);
        };
      };

      useEffect(() => {
        
        const filteredData = courseData.filter(item => {
          if (item.room_number !== null && item.room_number !== undefined) {
            return (
              item.room_seat.toString().toLowerCase().includes(filterValue.toLowerCase()) ||
              item.room_number.toLowerCase().includes(filterValue.toLowerCase()) 
              
            );
          } else {
            return false; 
          }
        });
        
        setFilteredCourseData(filteredData);
      }, [filterValue, courseData]);

      const handleFilterChange = (event) => {
        setFilterValue(event.target.value);
      };

    return (
        <div className="ml-28 mx-5 my-5">
            <div className="flex text-3xl font-bold">
                <p>นำเข้าห้องเรียน</p>
            </div>
            <div className="flex flex-row justify-between pt-5 h-90">
                {/* Add Course Form */}
                <form className="bg-from-color p-2 m-2 w-3/5 rounded-lg h-90 text-base">
                    {/* File Input for Course */}
                    <div className="flex flex-col justify-center ">
                        <div className="flex flex-row items-center justify-between">
                            <div className="flex items-center justify-between w-full bg-white rounded-full  p-1.5 m-1.5">
                                <input
                                type="file"
                                accept=".xlsx, .xls"
                                onChange={handleFileUpload}
                                className="rounded-full pl-1 text-sm py-1.5 w-3/4"
                                placeholder="ไฟล์หลักสูตรปีการศึกษา"/>
                            </div>
                        </div>
                    </div>
                    <form  className="bg-white flex m-2 p-2 rounded h-72">
                  {data.length > 0 && (
                    <table className="table-auto">
                      <thead>
                        <tr>
                        {Object.keys(data[0]).map((key) => (
                            <th key={key}>{key}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                          {data.map((row, index) => (
                            <tr key={index}>
                              {Object.values(row).map((value, index) => (
                                <td key={index}>{value}</td>
                              ))}
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  )}

            </form>
                    <div className="flex justify-end pt-2 pr-3">
                        <button className="bg-rose-color font-semibold text-white m-1 p-1 rounded-full w-1/4 hover:bg-red-900 active:bg-neutral-800">
                            อัพโหลด
                        </button>
                    </div>
                </form>
                {/* Add Room Form */}
                <form
                    className="bg-from-color p-2 m-2 w-2/5 rounded-lg h-90 justify-center"
                    onSubmit={handleImportroom}>
                    {/* Header */}
                    <div className="flex justify-center text-lg font-semibold pt-2">
                        <p>เพิ่มห้องเรียน</p>
                    </div>
                    <div className="flex justify-center">
                        <div className="flex flex-col justify-center text-base pt-2 w-9/12">
                            {/* Room Number Input */}
                            <div className="flex flex-row justify-between  w-full items-center py-2">
                                <label htmlFor="name">
                                    <p className="pr-1">เลขห้องเรียน</p>
                                </label>
                                <input
                                    type="text"
                                    className="rounded-full p-3 text-sm py-1.5 w-3/5  "
                                    placeholder="เลขห้อง"
                                    onChange={(event) => setRoom_number(event.target.value)}
                                />
                            </div>
                            {/* Number of Students Input */}
                            <div className="flex flex-row justify-between  w-full items-center py-2">
                                <label htmlFor="name">
                                    <p className="pr-1">จำนวนนิสิตที่รับ</p>
                                </label>
                                <input
                                    type="int"
                                    className="rounded-full p-3 text-sm py-1.5 w-3/5  "
                                    placeholder="จำนวนคน"
                                    onChange={(event) => setRoom_seat(parseInt(event.target.value))}
                                />
                            </div>
                        </div>
                    </div>
                    {/* Submit Button */}
                    <div className="flex justify-end pt-2 pr-3">
                        <button
                            className="bg-rose-color font-semibold text-white m-1 p-1 rounded-full w-1/4 hover:bg-red-900 active:bg-neutral-800"
                            type="submit"
                        >
                            เพิ่ม
                        </button>
                    </div>
                </form>
            </div>
            {/* Table of Courses */}
            <form className="justify-center">
                <div className="flex flex-row items-end justify-center w-full bg-white rounded-full pt-3 px-2">
                    <input
                    className="rounded-full px-2 text-sm py-2 w-3/5 border-2 border-rose-color"
                    placeholder="กรองข้อมูล"
                    value={filterValue}
                    onChange={handleFilterChange}
                    ></input>
                    {/* ส่วนอื่นๆของ input กรองข้อมูล */}
                </div>
                <table className="table-auto">
                    <thead>
                        <tr>
                            <th>ชื่อห้องเรียน</th>
                            <th>จำนวนนักศึกษา</th>
                            <th>
                                <div className="justify-center items-center">
                                    <div className="flex flex-row">
                                        <button
                                            type='button'
                                            className="p-2 my-2 mx-2 bg-red-300 rounded-lg w-1/2 hover:bg-zinc-500"
                                            onClick={handleCheckAll_open}
                                        >
                                            {buttonText_open}
                                        </button>
                                        <button
                                            type='button'
                                            className="p-2 my-2 mx-2 rounded-lg bg-yes-color w-1/2 hover:bg-zinc-500"
                                        >
                                            เปิด
                                        </button>
                                    </div>
                                </div>
                            </th>
                            <th>
                                <div className="justify-center items-center">
                                    <div className="flex flex-row">
                                        <button
                                            className="p-2 my-2 mx-2 bg-red-300 rounded-lg w-1/2 hover:bg-zinc-500"
                                            onClick={handleCheckAll_delete}
                                        >
                                            {buttonText_delete}
                                        </button>
                                        <button
                                            className="p-2 my-2 mx-2 rounded-lg bg-no-color w-1/2 hover:bg-zinc-500"
                                        >
                                            ลบ
                                        </button>
                                    </div>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            filteredCourseData.map((item) => (
                                <tr key={item.room_number}>
                                    <td>
                                        <p>{item.room_number}</p>
                                    </td>
                                    <td>
                                        <p>{item.room_seat}</p>
                                    </td>
                                    <td>
                                    <input
                                        type="checkbox"
                                        className="accent-rose-color w-7 h-7"
                                        onChange={() => handleCheckboxChange_open(item.room_number)}
                                        checked={selectedItems_open[item.room_number]}                
                                    />
                                    </td>
                                    <td>
                                    <input
                                        type="checkbox"
                                        className="accent-rose-color w-7 h-7"   
                                        onChange={() => handleCheckboxChange_delete(item.room_number)}
                                        checked={selectedItems_delete[item.room_number]}                
                                        />
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </form>
        </div>
    );
};

export default Addroom;