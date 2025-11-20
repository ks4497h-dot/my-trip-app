import React, { useState, useRef, useEffect } from 'react';
import { 
  Plane, MapPin, Coffee, Camera, ShoppingBag, DollarSign, 
  Calendar, Plus, Trash2, Utensils, Bus, CreditCard, 
  Ticket, X, Edit2, Check, Heart, Star, ArrowRight, Sparkles 
} from 'lucide-react';

// ----------------------------------------
// 1. 초기 데이터 (기능 유지)
// ----------------------------------------
const INITIAL_ITINERARY = {
  1: [
    { id: 101, time: '13:00', title: 'KUROMON MARKET', sub: '구로몬 시장', category: 'food', visited: false, photo: null, memo: '', location: 'Kuromon Ichiba Market' },
    { id: 102, time: '15:00', title: 'OSAKA CASTLE', sub: '오사카 성', category: 'landmark', visited: false, photo: null, memo: '', location: 'Osaka Castle' },
    { id: 103, time: '18:00', title: 'DOTONBORI', sub: '도톤보리', category: 'landmark', visited: false, photo: null, memo: '', location: 'Dotonbori' },
  ],
  2: [
    { id: 201, time: '09:00', title: 'USJ', sub: '유니버설 스튜디오', category: 'landmark', visited: false, photo: null, memo: '익스프레스 패스 챙기기!', location: 'Universal Studios Japan' },
    { id: 202, time: '18:00', title: 'UMEDA SKY', sub: '공중정원', category: 'landmark', visited: false, photo: null, memo: '', location: 'Umeda Sky Building' },
  ],
  3: [
    { id: 301, time: '09:00', title: 'FUSHIMI INARI', sub: '여우 신사', category: 'landmark', visited: false, photo: null, memo: '', location: 'Fushimi Inari Taisha' },
    { id: 302, time: '13:30', title: 'KIYOMIZU-DERA', sub: '청수사', category: 'landmark', visited: false, photo: null, memo: '', location: 'Kiyomizu-dera' },
  ],
  4: [
    { id: 401, time: '10:00', title: 'SHINSAIBASHI', sub: '쇼핑 거리', category: 'shopping', visited: false, photo: null, memo: '돈키호테 쿠폰 쓰기', location: 'Shinsaibashi' },
    { id: 402, time: '12:30', title: 'ICHIRAN RAMEN', sub: '이치란 라멘', category: 'food', visited: false, photo: null, memo: '', location: 'Ichiran Ramen' },
  ]
};

const EXPENSE_CATEGORIES = [
  { id: 'food', label: 'YUMMY', icon: Utensils, color: 'bg-[#FF90B3] text-black' },
  { id: 'cafe', label: 'COFFEE', icon: Coffee, color: 'bg-[#C5E066] text-black' },
  { id: 'cvs', label: 'SNACK', icon: ShoppingBag, color: 'bg-[#A2D2FF] text-black' },
  { id: 'transport', label: 'BUS/SUB', icon: Bus, color: 'bg-[#FFC8DD] text-black' },
  { id: 'shopping', label: 'BUY', icon: CreditCard, color: 'bg-[#BDE0FE] text-black' },
  { id: 'cash', label: 'CASH', icon: DollarSign, color: 'bg-gray-200 text-black' },
];

export default function JapanTripAppTrendy() {
  const [activeTab, setActiveTab] = useState('schedule');
  const [selectedDay, setSelectedDay] = useState(1);
  const [itinerary, setItinerary] = useState(INITIAL_ITINERARY);
  
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [isEditingTicket, setIsEditingTicket] = useState(false);
  const [flightInfo, setFlightInfo] = useState({
    depDate: '10.10', depTime: '09:00', depFlight: 'KE721',
    arrDate: '10.13', arrTime: '18:00', arrFlight: 'KE722',
    depAirport: 'ICN', arrAirport: 'KIX'
  });

  const [expenses, setExpenses] = useState([]);
  const [expenseForm, setExpenseForm] = useState({ date: 1, category: 'food', item: '', cost: '' });

  // ------------------- 기능 함수들 (V3와 동일) -------------------
  const toggleVisit = (day, id) => {
    setItinerary(prev => ({
      ...prev,
      [day]: prev[day].map(item => item.id === id ? { ...item, visited: !item.visited } : item)
    }));
  };

  const handlePhotoUpload = (day, id, e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setItinerary(prev => ({
        ...prev,
        [day]: prev[day].map(item => item.id === id ? { ...item, photo: imageUrl } : item)
      }));
    }
  };

  const updateMemo = (day, id, text) => {
    setItinerary(prev => ({
      ...prev,
      [day]: prev[day].map(item => item.id === id ? { ...item, memo: text } : item)
    }));
  };

  const handleFlightChange = (e) => {
    const { name, value } = e.target;
    setFlightInfo(prev => ({ ...prev, [name]: value }));
  };

  const addExpense = () => {
    if (!expenseForm.item || !expenseForm.cost) return;
    const newExp = {
      id: Date.now(),
      date: Number(expenseForm.date),
      category: expenseForm.category,
      item: expenseForm.item,
      cost: Number(expenseForm.cost)
    };
    setExpenses([...expenses, newExp]);
    setExpenseForm({ ...expenseForm, item: '', cost: '' });
  };

  const deleteExpense = (id) => setExpenses(expenses.filter(e => e.id !== id));
  const totalCost = expenses.reduce((acc, curr) => acc + curr.cost, 0);
  const getCategoryInfo = (catId) => EXPENSE_CATEGORIES.find(c => c.id === catId) || EXPENSE_CATEGORIES[0];

  return (
    <div className="max-w-md mx-auto h-screen bg-[#F9F5F1] flex flex-col font-sans text-gray-900 shadow-2xl overflow-hidden relative">
      
      {/* 🎨 배경 그래픽 효과 (Blur Blobs) */}
      <div className="absolute top-[-50px] left-[-50px] w-64 h-64 bg-[#FF90B3] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-[#C5E066] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-50px] left-[20%] w-64 h-64 bg-[#A2D2FF] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      {/* 헤더 */}
      <header className="pt-8 px-6 pb-4 z-20 shrink-0">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-black bg-black text-white px-2 py-0.5 rounded-full">2025</span>
              <span className="text-xs font-bold text-[#FF90B3] tracking-widest">XXX</span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter leading-[0.9]">
              OSAKA<br/>TRIP<span className="text-[#C5E066]">.</span>
            </h1>
          </div>
          <button 
            onClick={() => setShowTicketModal(true)}
            className="bg-white border-2 border-black px-3 py-3 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all active:bg-[#FF90B3]"
          >
            <Ticket size={24} strokeWidth={2.5} />
          </button>
        </div>
        
        {/* 장식용 라인 */}
        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 mt-2">
          <span>01.25</span>
          <div className="h-px bg-gray-300 flex-1"></div>
          <span className="text-[#FF90B3]">>>></span>
          <span className="text-[#C5E066]">XXX</span>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <div className="flex-1 overflow-y-auto p-5 pb-24 scrollbar-hide z-10">
        
        {/* ================= 일정 탭 ================= */}
        {activeTab === 'schedule' && (
          <div className="space-y-6 animate-fade-in">
            
            {/* 날짜 선택 (스티커 스타일) */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {[1, 2, 3, 4].map(day => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`shrink-0 w-16 h-20 flex flex-col items-center justify-center border-2 border-black rounded-xl transition-all ${
                    selectedDay === day 
                    ? 'bg-[#C5E066] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-1' 
                    : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  <span className="text-xs font-bold">DAY</span>
                  <span className="text-2xl font-black italic">0{day}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
               <div className="bg-black text-white text-xs font-bold px-2 py-1 rotate-3">MY PLAN</div>
               <div className="h-0.5 bg-black flex-1"></div>
               <Sparkles size={16} className="text-[#FF90B3]" fill="currentColor"/>
            </div>

            {/* 일정 리스트 */}
            <div className="space-y-4">
              {itinerary[selectedDay].map((item) => (
                <div key={item.id} className={`relative bg-white border-2 border-black p-5 transition-all ${item.visited ? 'opacity-60 grayscale' : 'shadow-[6px_6px_0px_0px_#FF90B3]'}`}>
                  
                  {/* 장식용 모서리 테이프 느낌 */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#C5E066]/50 rounded-full blur-sm"></div>

                  <div className="flex items-start gap-4">
                    {/* 시간 & 체크 */}
                    <div className="flex flex-col items-center gap-2">
                      <button 
                        onClick={() => toggleVisit(selectedDay, item.id)}
                        className={`w-8 h-8 border-2 border-black flex items-center justify-center transition-all ${
                          item.visited ? 'bg-black text-white' : 'bg-white hover:bg-gray-100'
                        }`}
                      >
                        {item.visited && <Check size={20} strokeWidth={4} />}
                      </button>
                      <span className="text-xs font-black bg-[#FF90B3] px-1 border border-black">{item.time}</span>
                    </div>

                    {/* 내용 */}
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-2xl font-black uppercase leading-none tracking-tight ${item.visited && 'line-through decoration-2 decoration-black'}`}>
                        {item.title}
                      </h3>
                      <p className="text-sm font-bold text-gray-500 mt-1">{item.sub}</p>
                      
                      <a href={`https://www.google.com/maps/search/?api=1&query=${item.location}`}
                         target="_blank" rel="noreferrer"
                         className="inline-flex items-center gap-1 text-[10px] font-bold mt-2 bg-gray-100 px-2 py-1 rounded border border-black hover:bg-[#C5E066] transition-colors">
                        <MapPin size={10} /> GOOGLE MAP
                      </a>
                    </div>
                  </div>

                  {/* 하단: 사진 & 메모 (V3 기능 유지, 디자인 변경) */}
                  <div className="mt-4 grid grid-cols-5 gap-2">
                    {/* 사진 */}
                    <div className="col-span-2 relative aspect-square">
                      {item.photo ? (
                        <div className="w-full h-full border-2 border-black relative group">
                          <img src={item.photo} alt="Memory" className="w-full h-full object-cover" />
                          <button 
                             onClick={() => setItinerary(prev => ({...prev, [selectedDay]: prev[selectedDay].map(i => i.id === item.id ? {...i, photo: null} : i)}))}
                             className="absolute top-1 right-1 bg-black text-white p-0.5"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ) : (
                        <label className="w-full h-full bg-[#FDF8F4] border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-[#FF90B3] hover:text-[#FF90B3] transition-all">
                          <Camera size={20} />
                          <span className="text-[10px] font-bold mt-1">PHOTO</span>
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => handlePhotoUpload(selectedDay, item.id, e)} />
                        </label>
                      )}
                    </div>

                    {/* 메모 */}
                    <div className="col-span-3 relative">
                      <textarea 
                        placeholder="WRITE MEMO..."
                        className="w-full h-full bg-[#FDF8F4] border-2 border-gray-200 p-2 text-xs font-medium resize-none outline-none focus:border-black focus:bg-white"
                        value={item.memo}
                        onChange={(e) => updateMemo(selectedDay, item.id, e.target.value)}
                      />
                      <div className="absolute bottom-2 right-2 w-2 h-2 bg-[#C5E066] rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= 가계부 탭 ================= */}
        {activeTab === 'money' && (
          <div className="space-y-6 animate-fade-in">
             <div className="relative bg-black text-white p-6 border-b-4 border-[#FF90B3]">
                <div className="absolute top-4 right-4 text-[#C5E066] animate-spin-slow">
                  <Star size={32} fill="currentColor" />
                </div>
                <h2 className="text-xs font-bold tracking-widest text-gray-400 mb-1">TOTAL SPENT</h2>
                <div className="text-5xl font-black tracking-tighter">¥{totalCost.toLocaleString()}</div>
                <p className="text-right text-xs font-mono mt-2 text-[#FF90B3]">KRW : {(totalCost * 9).toLocaleString()}</p>
             </div>

             <div className="bg-white border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-black text-lg flex items-center gap-2">
                    ADD COST <ArrowRight size={16} />
                  </h3>
                  <div className="flex gap-1">
                     <div className="w-2 h-2 bg-[#FF90B3] rounded-full"></div>
                     <div className="w-2 h-2 bg-[#C5E066] rounded-full"></div>
                  </div>
                </div>

                <div className="flex gap-2 mb-2">
                   <select 
                      className="bg-gray-100 font-bold text-sm p-2 rounded border border-black outline-none"
                      value={expenseForm.date} onChange={(e) => setExpenseForm({...expenseForm, date: e.target.value})}
                   >
                      {[1,2,3,4].map(d => <option key={d} value={d}>D-0{d}</option>)}
                   </select>
                   <input 
                      type="text" placeholder="WHAT?" 
                      className="flex-1 bg-gray-100 font-bold text-sm p-2 rounded border border-black outline-none"
                      value={expenseForm.item} onChange={(e) => setExpenseForm({...expenseForm, item: e.target.value})}
                   />
                </div>
                <div className="flex gap-2 mb-3">
                   <input 
                      type="number" placeholder="HOW MUCH?" 
                      className="flex-1 bg-gray-100 font-bold text-sm p-2 rounded border border-black outline-none"
                      value={expenseForm.cost} onChange={(e) => setExpenseForm({...expenseForm, cost: e.target.value})}
                   />
                   <select 
                      className="bg-gray-100 font-bold text-sm p-2 rounded border border-black outline-none w-24"
                      value={expenseForm.category} onChange={(e) => setExpenseForm({...expenseForm, category: e.target.value})}
                   >
                      {EXPENSE_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                   </select>
                </div>
                <button onClick={addExpense} className="w-full bg-black text-white font-black py-3 hover:bg-[#C5E066] hover:text-black transition-colors border-2 border-black">
                   SAVE IT!
                </button>
             </div>

             <div className="space-y-4">
              {[1, 2, 3, 4].map(day => {
                const dayExpenses = expenses.filter(e => e.date === day);
                if (dayExpenses.length === 0) return null;
                return (
                  <div key={day}>
                    <div className="flex items-center gap-2 mb-2">
                       <span className="bg-[#C5E066] px-2 py-0.5 text-xs font-black border border-black">DAY 0{day}</span>
                       <div className="h-px bg-black flex-1"></div>
                    </div>
                    <div className="space-y-2">
                      {dayExpenses.map((exp) => {
                        const catInfo = getCategoryInfo(exp.category);
                        const Icon = catInfo.icon;
                        return (
                          <div key={exp.id} className="flex items-center justify-between bg-white border border-black p-2 shadow-sm">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 flex items-center justify-center border border-black ${catInfo.color}`}>
                                <Icon size={14} />
                              </div>
                              <span className="font-bold text-sm">{exp.item}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="font-black">¥{exp.cost}</span>
                              <button onClick={() => deleteExpense(exp.id)} className="text-gray-300 hover:text-red-500"><Trash2 size={14} /></button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* 하단 네비게이션 */}
      <nav className="bg-white border-t-2 border-black px-8 py-4 flex justify-between items-center z-20 pb-8">
        <button 
           onClick={() => setActiveTab('schedule')} 
           className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all border-2 border-transparent ${activeTab === 'schedule' ? 'bg-[#FF90B3] border-black font-bold' : 'text-gray-400'}`}
        >
          <Calendar size={20} strokeWidth={3} />
          {activeTab === 'schedule' && <span className="text-xs">PLAN</span>}
        </button>
        <button 
           onClick={() => setActiveTab('money')} 
           className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all border-2 border-transparent ${activeTab === 'money' ? 'bg-[#C5E066] border-black font-bold' : 'text-gray-400'}`}
        >
          <DollarSign size={20} strokeWidth={3} />
          {activeTab === 'money' && <span className="text-xs">MONEY</span>}
        </button>
      </nav>

      {/* ================= 항공권 모달 (V3 기능 유지 + 디자인 리뉴얼) ================= */}
      {showTicketModal && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#F9F5F1] w-full max-w-sm border-2 border-black shadow-[8px_8px_0px_0px_#C5E066] relative overflow-hidden">
            
            {/* 장식 배경 */}
            <div className="absolute top-[-20px] right-[-20px] w-24 h-24 bg-[#FF90B3] rounded-full blur-xl opacity-50"></div>

            {/* 헤더 */}
            <div className="bg-black text-white p-4 flex justify-between items-center relative z-10">
              <h3 className="font-black italic text-xl tracking-widest">BOARDING PASS</h3>
              <div className="flex gap-2">
                <button onClick={() => setIsEditingTicket(!isEditingTicket)} className="p-1 bg-gray-700 hover:bg-[#C5E066] hover:text-black transition-colors">
                  {isEditingTicket ? <Check size={16}/> : <Edit2 size={16} />}
                </button>
                <button onClick={() => setShowTicketModal(false)} className="p-1 bg-gray-700 hover:bg-[#FF90B3] hover:text-black transition-colors">
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="p-6 relative z-10">
               {/* 공항 코드 */}
               <div className="flex justify-between items-center mb-6 border-b-2 border-dashed border-gray-300 pb-6">
                  <div className="text-center">
                     <div className="text-xs font-bold text-gray-400 mb-1">FROM</div>
                     {isEditingTicket ? 
                       <input name="depAirport" value={flightInfo.depAirport} onChange={handleFlightChange} className="w-16 text-center font-black text-3xl bg-transparent border-b-2 border-black" /> :
                       <div className="text-4xl font-black">{flightInfo.depAirport}</div>
                     }
                  </div>
                  <Plane size={24} className="text-[#FF90B3] rotate-90" />
                  <div className="text-center">
                     <div className="text-xs font-bold text-gray-400 mb-1">TO</div>
                     {isEditingTicket ? 
                       <input name="arrAirport" value={flightInfo.arrAirport} onChange={handleFlightChange} className="w-16 text-center font-black text-3xl bg-transparent border-b-2 border-black" /> :
                       <div className="text-4xl font-black">{flightInfo.arrAirport}</div>
                     }
                  </div>
               </div>

               {/* 상세 정보 */}
               <div className="space-y-4">
                  <div className="flex justify-between items-center bg-white border border-black p-3 shadow-[2px_2px_0px_0px_#FF90B3]">
                     <div>
                        <div className="text-[10px] font-bold bg-[#FF90B3] inline-block px-1 mb-1 border border-black">DEPARTURE</div>
                        {isEditingTicket ? 
                           <div className="flex gap-1"><input name="depDate" value={flightInfo.depDate} onChange={handleFlightChange} className="w-12 text-xs border" /><input name="depTime" value={flightInfo.depTime} onChange={handleFlightChange} className="w-12 text-xs border" /></div> :
                           <div className="font-black text-xl">{flightInfo.depDate} <span className="text-sm font-medium">{flightInfo.depTime}</span></div>
                        }
                     </div>
                     {isEditingTicket ? <input name="depFlight" value={flightInfo.depFlight} onChange={handleFlightChange} className="w-12 text-xs border" /> : <div className="font-mono font-bold">{flightInfo.depFlight}</div>}
                  </div>

                  <div className="flex justify-between items-center bg-white border border-black p-3 shadow-[2px_2px_0px_0px_#C5E066]">
                     <div>
                        <div className="text-[10px] font-bold bg-[#C5E066] inline-block px-1 mb-1 border border-black">RETURN</div>
                        {isEditingTicket ? 
                           <div className="flex gap-1"><input name="arrDate" value={flightInfo.arrDate} onChange={handleFlightChange} className="w-12 text-xs border" /><input name="arrTime" value={flightInfo.arrTime} onChange={handleFlightChange} className="w-12 text-xs border" /></div> :
                           <div className="font-black text-xl">{flightInfo.arrDate} <span className="text-sm font-medium">{flightInfo.arrTime}</span></div>
                        }
                     </div>
                     {isEditingTicket ? <input name="arrFlight" value={flightInfo.arrFlight} onChange={handleFlightChange} className="w-12 text-xs border" /> : <div className="font-mono font-bold">{flightInfo.arrFlight}</div>}
                  </div>
               </div>

               {/* 바코드 */}
               <div className="mt-6 pt-4 border-t-2 border-black">
                  <div className="h-12 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/UPC-A-036000291452.svg/1200px-UPC-A-036000291452.svg.png')] bg-cover opacity-80 grayscale"></div>
                  <div className="text-center text-[10px] font-mono mt-1 tracking-[0.5em]">TICKET NO. 8829301</div>
               </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
}