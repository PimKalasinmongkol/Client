import React, { useState, useEffect } from "react";
import * as XLXS from 'xlsx';


const Contact = () => {
  const [data,setData] = useState([])
  const [selectedYear, setSelectedYear] = useState("");
  const [years, setYears] = useState([]);
  const [subject_nameTH, setSubject_nameTH] = useState("");
  const [subject_nameEN, setSubject_nameEN] = useState("");
  const [credit, setCredit] = useState(0);
  const [subject_id, setSubject_id] = useState("");
  const [type, setType] = useState("");
  const [courseData ,setCourseData] = useState([])
  const [filteredCourseData, setFilteredCourseData] = useState([]); // เพิ่ม state สำหรับเก็บข้อมูลที่ถูกกรอง
  const [filterValue, setFilterValue] = useState(""); // เพิ่ม state เพื่อใช้ในการกรองข้อมูล
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
      allSelected_open[item.subject_id] = !allSelected;
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
      allSelected_delete[item.subject_id] = !allSelected;
    });
  
    // Update selectedItems_delete state with allSelected_delete
    setSelectedItems_delete(allSelected_delete);

    if (allSelected) {
      setButtonText_delete("เลือกทั้งหมด");
    } else {
      setButtonText_delete("ยกเลิกทั้งหมด");
    }
  };

     
  async function handleImportCourse() {
    try {
      await fetch("http://localhost:4000/course/importCourse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject_id: subject_id,
          subject_nameEN: subject_nameEN,
          subject_nameTH: subject_nameTH,
          credit: credit,
          type: type,
          school_year: selectedYear,
        }),
      });
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    (async function() {
      const res = await fetch("http://localhost:4000/course/getAllCourses")
      const data = await res.json();
      setCourseData(data);
    })()
  }, [courseData])

  useEffect(() => {
    const currentYear = new Date().getFullYear() + 543;
    const yearOptions = [];

    for (let i = currentYear - 10; i <= currentYear + 10; i++) {
      if (i % 5 === 0 || i % 5 === 5) {
        yearOptions.push(i);
      }
    }

    setYears(yearOptions);
    setSelectedYear(currentYear);
  }, []);

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  useEffect(() => {
    // ใช้ filterValue เพื่อกรองข้อมูลที่แสดงในตาราง
    const filteredData = courseData.filter(item => {
      // ตรวจสอบว่า subject_id ไม่ใช่ null หรือ undefined
      if (item.subject_id !== null && item.subject_id !== undefined) {
        // ใช้ toLowerCase() เมื่อ subject_id เป็น string เท่านั้น
        return (
          item.subject_id.toString().toLowerCase().includes(filterValue.toLowerCase()) ||
          item.subject_nameEN.toLowerCase().includes(filterValue.toLowerCase()) ||
          item.subject_nameTH.toLowerCase().includes(filterValue.toLowerCase())
          // และอื่นๆ ตามเงื่อนไขที่ต้องการกรอง
        );
      } else {
        return false; // ถ้า subject_id เป็น null หรือ undefined ให้ไม่รวมเข้าไปในการกรอง
      }
    });
    
    setFilteredCourseData(filteredData);
  }, [filterValue, courseData]);

  const handleFilterChange = (event) => {
    setFilterValue(event.target.value);
  };

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


  return (
    <div className="ml-28 mx-5 my-5">
      <div className="flex text-3xl font-bold">
        <p>นำเข้าหลักสูตร</p>
      </div>
      <div className="flex flex-row justify-between pt-5 h-90">
        <form className="bg-from-color p-2 m-2 w-3/5 rounded-lg h-90 text-base">
          <div className="flex flex-col justify-center h-90">
            <div className="flex flex-row items-center justify-between">
              <div className="flex items-center justify-between w-3/5 bg-white rounded-full  p-1 m-1">
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleFileUpload}
                  className="rounded-full pl-1 text-sm py-1.5 w-3/4"
                  placeholder="ไฟล์หลักสูตรปีการศึกษา"
                ></input>
              </div>

              <div className="flex flex-row justify-end items-center  w-2/5">
                <p className="p-2">ปีหลักสูตร</p>
                <div className="flex items-center justify-between w-3/5 bg-white rounded-full  p-2 m-1">
                  <select value={selectedYear} onChange={handleYearChange}
                    className="rounded-full pl-1 text-sm py-1.5 w-full "
                    name="year"
                    id="year"
                  >
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
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
          </div>
          <div className="flex justify-end pt-2 pr-3">
            <button className="bg-rose-color font-semibold text-white m-1 p-1 rounded-full w-1/4 hover:bg-red-900 active:bg-neutral-800">
              อัพโหลด
            </button>
            
          </div>
        </form>
        <form
          className="bg-from-color p-2 m-2 w-2/5 rounded-lg h-90 justify-center"
          onSubmit={handleImportCourse}
        >
          <div className="flex justify-center text-lg font-semibold pt-2">
            <p>นำเข้ารายวิชา</p>
          </div>
          <div className="flex justify-center">
            <div className="flex flex-col justify-center text-lg text-base pt-2 w-9/12">
              <div className="flex flex-row justify-between  w-full items-center py-2">
                <label for="name">
                  <p className="pr-1">รหัสวิชา</p>
                </label>
                <input
                  type="text"
                  className="rounded-full p-3 text-sm py-1.5 w-3/5 "
                  placeholder="รหัสวิชา"
                  onChange={(event) => setSubject_id(event.target.value)}
                />
              </div>

              <div className="flex flex-row justify-between  w-full items-center py-2">
                <label for="name">
                  <p className="pr-1">หลักสูตร</p>
                </label>
                <select value={selectedYear} onChange={handleYearChange}
                  className="rounded-full pl-1 text-sm py-1.5 w-3/5 "
                  name="year"
                  id="year"
                >
                  {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                </select>
              </div>

              <div className="flex flex-row justify-between  w-full items-center py-2">
                <label for="name">
                  <p className="pr-1">ชื่อวิชา-อังกฤษ</p>
                </label>
                <input
                  type="text"
                  className="rounded-full p-3 text-sm py-1.5 w-3/5  "
                  placeholder="ชื่อวิชาภาษาอังกฤษ"
                  onChange={(event) => setSubject_nameEN(event.target.value)}
                />
              </div>

              <div className="flex flex-row justify-between  w-full items-center py-2">
                <label for="name">
                  <p className="pr-1">ชื่อวิชา-ภาษาไทย</p>
                </label>
                <input
                  type="text"
                  className="rounded-full p-3 text-sm py-1.5 w-3/5  "
                  placeholder="ชื่อวิชาภาษาไทย"
                  onChange={(event) => setSubject_nameTH(event.target.value)}
                />
              </div>

              <div className="flex flex-row justify-between  w-full items-center py-2">
                <label for="name">
                  <p className="pr-1">ประเภท</p>
                </label>
                <select
                  className="rounded-full pl-1 text-sm py-1.5 w-3/5 "
                  name="year"
                  id="year"
                  onChange={(event) => setType(event.target.value)}
                >
                  <option value="">ประเภทวิชา</option>
                  <option value={"1"}>วิชาแกน</option>
                  <option value={"2"}>วิชาเฉพาะบังคับ</option>
                  <option value={"3"}>วิชาเลือก</option>
                </select>
              </div>

              <div className="flex flex-row justify-between  w-full items-center py-2">
                <label for="name">
                  <p className="pr-1">หน่วยกิต</p>
                </label>
                <input
                  type="text"
                  className="rounded-full p-3 text-sm py-1.5 w-3/5  "
                  placeholder="หน่วยกิต"
                  onChange={(event) => setCredit(parseInt(event.target.value))}
                />
              </div>
            </div>
          </div>
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
        <table class="table-auto">
          <thead>
            <tr>
              <th>รหัสวิชา</th>
              <th>ชื่อวิชาภาษาอังกฤษ</th>
              <th>ชื่อวิชาภาษาไทย</th>
              <th>หน่วยกิต</th>
              <th>ประเภท</th>
              <th>
                <div className="justify-center items-center">
                  <div className="flex flex-row">
                    <button type='button' className="p-2 my-2 mx-2 bg-red-300 rounded-lg w-1/2 hover:bg-zinc-500" 
                    onClick={handleCheckAll_open}>
                      {buttonText_open}
                    </button>
                    <button type='button' className="p-2 my-2 mx-2 rounded-lg bg-yes-color w-1/2 hover:bg-zinc-500"
                    >
                      เปิด
                    </button>
                  </div>
                </div>
              </th>
              <th>
                <div className="justify-center items-center">
                  <div className="flex flex-row">
                  <button className="p-2 my-2 mx-2 bg-red-300 rounded-lg w-1/2 hover:bg-zinc-500" 
                  type="button"
                  onClick={handleCheckAll_delete}>
                    {buttonText_delete}
                  </button>
                  <button className="p-2 my-2 mx-2 rounded-lg bg-no-color w-1/2 hover:bg-zinc-500">
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
                <tr key={item.subject_id}>
                  <td>
                    <p>{item.subject_id}</p>
                  </td>
                  <td>
                    <p>{item.subject_nameEN}</p>
                  </td>
                  <td>
                    <p>{item.subject_nameTH}</p>
                  </td>
                  <td>
                    <p>{item.credit}</p>
                  </td>
                  <td>
                    <p>{item.type === '1' ? 'วิชาแกน' : item.type === '2' ? 'วิชาเฉพาะบังคับ' : 'วิชาเลือก'}</p>
                  </td>

                  <td>
                  <label key = {item.subject_id}>
                    <input
                    type="checkbox"
                    className="accent-rose-color w-7 h-7"
                    onChange={() => handleCheckboxChange_open(item.subject_id)}
                    checked={selectedItems_open[item.subject_id]}                
                    />
                  </label>
                  </td>

                  <td>
                  <label key = {item.subject_id}>
                    <input
                    type="checkbox"
                    className="accent-rose-color w-7 h-7"   
                    onChange={() => handleCheckboxChange_delete(item.subject_id)}
                    checked={selectedItems_delete[item.subject_id]}                
                    />
                  </label>
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
export default Contact;