import React from "react";

function Calculation() {
  return (
    <div className="lg:w-[400px] md:w-3/5 w-full absolute bottom-6 right-0 bg-white p-4 rounded-2xl shadow-lg z-50">
      <h2>Calculation</h2>
      <div>
        <table className="text-sm">
          <thead>
            <tr>
              <th>Bậc thuế</th>
              <th>Phần thu nhập thuế/năm (triệu đồng)</th>
              <th>Phần thu nhập thuế/tháng</th>
              <th>Thuế suất</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Đến 60</td>
              <td>Đến 5</td>
              <td>5</td>
            </tr>
            <tr>
              <td>2</td>
              <td>Trên 60 đến 120</td>
              <td>Trên 5 đến 10</td>
              <td>10</td>
            </tr>
            <tr>
              <td>3</td>
              <td>Trên 120 đến 216</td>
              <td>Trên 10 đến 18</td>
              <td>15</td>
            </tr>
            <tr>
              <td>4</td>
              <td>Trên 216 đến 384</td>
              <td>Trên 18 đến 32</td>
              <td>20</td>
            </tr>
            <tr>
              <td>5</td>
              <td>Trên 384 đến 624</td>
              <td>Trên 32 đến 52</td>
              <td>25</td>
            </tr>
            <tr>
              <td>6</td>
              <td>Trên 624 đến 960</td>
              <td>Trên 52 đến 80</td>
              <td>30</td>
            </tr>
            <tr>
              <td>7</td>
              <td>Trên 90</td>
              <td>Trên 80</td>
              <td>35</td>
            </tr>
          </tbody>
        </table>
        <div className="mt-3">
          <p className="text-sm font-bold">Các khoản giảm trừ</p>
          <ul className="list-disc text-sm ms-4">
            <li>
              Giảm trừ gia cảnh đối với bản thân người nộp thuế là 11 triệu
              đồng/tháng (132 triệu đồng/năm).
            </li>
            <li>
              Giảm trừ gia cảnh đối với mỗi người phụ thuộc là 4,4 triệu
              đồng/tháng.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Calculation;
