import React, { useState, useEffect } from "react";

const Contact = () => {
  const [subject_nameTH, setSubject_nameTH] = useState("");
  const [subject_nameEN, setSubject_nameEN] = useState("");
  const [credit, setCredit] = useState(0);
  const [school_year, setSchool_year] = useState("");
  const [subject_id, setSubject_id] = useState("");
  const [type, setType] = useState("");
  const [courseData ,setCourseData] = useState([])
  const [selectAllCheckbox_open, setSelectAllCheckbox_open] = useState(false);
  const [selectAllCheckbox_delete, setSelectAllCheckbox_delete] = useState(false);

  const handleSelectAllCheckboxOpen = () => {
    setSelectAllCheckbox_open(!selectAllCheckbox_open);
  };
  
  const handleSelectAllCheckboxDelete = () => {
    setSelectAllCheckbox_delete(!selectAllCheckbox_delete);
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
          school_year: school_year,
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

  return (
    <div className="ml-28 mx-5 my-5">
      <div className="flex text-3xl font-bold">
        <p>นำเข้าหลักสูตร</p>
      </div>
      <div className="flex flex-row justify-between pt-5 h-90">
        <form className="bg-from-color p-2 m-2 w-3/5 rounded-lg h-90 text-base">
          <div className="flex flex-col justify-center ">
            <div className="flex flex-row items-center justify-between">
              <div className="flex items-center justify-between w-3/5 bg-white rounded-full  p-1 m-1">
                <input
                  className="rounded-full pl-1 text-sm py-1.5 w-3/4"
                  placeholder="ไฟล์หลักสูตรปีการศึกษา"
                ></input>
                <button className="bg-rose-color font-semibold text-white m-1 p-1 rounded-full w-1/4 hover:bg-red-900 active:bg-neutral-800">
                  เลือก
                </button>
              </div>

              <div className="flex flex-row justify-end items-center  w-2/5">
                <p className="p-2">ปีหลักสูตร</p>
                <div className="flex items-center justify-between w-3/5 bg-white rounded-full  p-2 m-1">
                  <select
                    className="rounded-full pl-1 text-sm py-1.5 w-full "
                    name="year"
                    id="year"
                  >
                    <option value="">ปีการศึกษา</option>
                    <option value="2560">2560</option>
                    <option value="2565">2565</option>
                    <option value="2570">2570</option>
                  </select>
                </div>
              </div>
            </div>
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
                <select
                  className="rounded-full pl-1 text-sm py-1.5 w-3/5 "
                  name="year"
                  id="year"
                  onChange={(event) => setSchool_year(event.target.value)}
                >
                  <option value="">ปีการศึกษา</option>
                  <option value="2560">2560</option>
                  <option value="2565">2565</option>
                  <option value="2570">2570</option>
                </select>
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
                  <p className="pr-1">ประเภท</p>
                </label>
                <select
                  className="rounded-full pl-1 text-sm py-1.5 w-3/5 "
                  name="year"
                  id="year"
                  onChange={(event) => setType(event.target.value)}
                >
                  <option value="">ประเภทวิชา</option>
                  <option value={"วิชาแกน"}>วิชาแกน</option>
                  <option value={"วิชาเฉพาะบังคับ"}>วิชาเฉพาะบังคับ</option>
                  <option value={"วิชาเลือก"}>วิชาเลือก</option>
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
      <form>
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
                    onClick={handleSelectAllCheckboxOpen}>
                      เลือกทั้งหมด
                    </button>
                    <button type='button' className="p-2 my-2 mx-2 rounded-lg bg-yes-color w-1/2 hover:bg-zinc-500">
                      เปิด
                    </button>
                  </div>
                </div>
              </th>
              <th>
                <div className="justify-center items-center">
                  <div className="flex flex-row">
                    <button className="p-2 my-2 mx-2 bg-red-300 rounded-lg w-1/2 hover:bg-zinc-500"
                    onClick={handleSelectAllCheckboxDelete}>
                      เลือกทั้งหมด
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
              courseData.map((item) => (
                <tr>
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
                    <p>{item.type}</p>
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      class="accent-rose-color w-7 h-7"
                      onChange={() => setSelectAllCheckbox_open(selectAllCheckbox_open)}
                    />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      class="accent-rose-color w-7 h-7"
                      onChange={() => setSelectAllCheckbox_delete(selectAllCheckbox_delete)}
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
export default Contact;
