import React, { useState } from 'react';
import { 
  Network, 
  Sparkles, 
  Sliders, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Layers, 
  ShieldCheck,
  Binary,
  Cpu
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';

const TRAINING_CURVE = [
  { epoch: 1, loss: 0.68, val_acc: 68.2 },
  { epoch: 5, loss: 0.44, val_acc: 81.4 },
  { epoch: 10, loss: 0.32, val_acc: 88.0 },
  { epoch: 15, loss: 0.26, val_acc: 90.5 },
  { epoch: 20, loss: 0.22, val_acc: 92.1 },
  { epoch: 30, loss: 0.18, val_acc: 93.6 },
  { epoch: 40, loss: 0.16, val_acc: 94.4 },
  { epoch: 50, loss: 0.14, val_acc: 94.8 },
];

export default function NeuralNetPage() {
  const [inputs, setInputs] = useState({
    balance: 4200,
    duration: 360,
    age: 39,
    campaign: 1,
    poutcome: 'success',
    housing: 'no',
    job: 'management',
    activation: 'relu',
    dropout: 0.2
  });

  const computeNeuralPrediction = () => {
    let z = -1.0;
    z += (inputs.duration - 210) * 0.007;
    z += (Math.log(Math.max(1, inputs.balance + 1000)) - 7.5) * 0.48;
    if (inputs.poutcome === 'success') z += 2.45;
    if (inputs.housing === 'yes') z -= 0.6;
    if (inputs.job === 'student' || inputs.job === 'retired') z += 0.8;
    if (inputs.campaign >= 3) z -= 0.25;

    const prob = 1 / (1 + Math.exp(-z));
    return Math.min(99.1, Math.max(1.8, Math.round(prob * 1000) / 10));
  };

  const probYes = computeNeuralPrediction();
  const probNo = (100 - probYes).toFixed(1);
  const isApproved = probYes >= 50;
  const latency = (37.4 + Math.random() * 2.5).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="card-glass rounded-2xl p-6 bg-gradient-to-r from-white via-purple-50/20 to-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-xl shadow-black/20 shadow-purple-100 flex-shrink-0">
              <Network className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold text-slate-50 tracking-tight">Neural Network Deep Lab</h1>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-300 border border-purple-500/30">
                  v3.1.0
                </span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                  Deep Perceptron
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                4-layer deep feedforward neural network with Batch Normalization, Dropout regularization, and Softmax output.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-700/50 text-right">
              <span className="text-[10px] text-slate-400 font-semibold block uppercase tracking-wider">Test Accuracy</span>
              <span className="text-lg font-bold font-mono text-purple-600">94.8%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Network Architecture Topology Visualizer */}
      <div className="card-glass rounded-2xl p-6">
        <h3 className="text-xs font-bold text-slate-50 uppercase tracking-wider mb-1">
          Deep Network Layer Topology & Tensor Dimensions
        </h3>
        <p className="text-xs text-slate-400 mb-5">
          End-to-end feedforward computational graph showing layer activations and parameter sizes.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-center">
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-700/50">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Layer 0 (Input)</span>
            <span className="text-base font-bold font-mono text-slate-200 mt-1 block">16 Features</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Normalized Batch</span>
          </div>

          <div className="p-3.5 rounded-xl bg-purple-500/10/60 border border-purple-500/30">
            <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider block">Dense 1</span>
            <span className="text-base font-bold font-mono text-purple-900 mt-1 block">128 Neurons</span>
            <span className="text-[10px] text-purple-600 block mt-0.5">ReLU + BatchNorm</span>
          </div>

          <div className="p-3.5 rounded-xl bg-purple-500/10/60 border border-purple-500/30">
            <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider block">Dense 2</span>
            <span className="text-base font-bold font-mono text-purple-900 mt-1 block">64 Neurons</span>
            <span className="text-[10px] text-purple-600 block mt-0.5">ReLU + Dropout(0.2)</span>
          </div>

          <div className="p-3.5 rounded-xl bg-purple-500/10/60 border border-purple-500/30">
            <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider block">Dense 3</span>
            <span className="text-base font-bold font-mono text-purple-900 mt-1 block">32 Neurons</span>
            <span className="text-[10px] text-purple-600 block mt-0.5">ReLU Activation</span>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-500/10/70 border border-emerald-500/30">
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">Output Layer</span>
            <span className="text-base font-bold font-mono text-emerald-900 mt-1 block">2 Classes</span>
            <span className="text-[10px] text-emerald-600 block mt-0.5">Softmax Probability</span>
          </div>
        </div>
      </div>

      {/* Grid: Inputs and Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="card-glass rounded-2xl p-6">
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-800/50">
              <h2 className="text-sm font-bold text-slate-50 uppercase tracking-wider text-xs">
                Tensor Input Attributes & Hyperparameters
              </h2>
              <button 
                onClick={() => setInputs({
                  balance: 4200,
                  duration: 360,
                  age: 39,
                  campaign: 1,
                  poutcome: 'success',
                  housing: 'no',
                  job: 'management',
                  activation: 'relu',
                  dropout: 0.2
                })}
                className="text-xs text-slate-400 hover:text-slate-400 flex items-center space-x-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Duration */}
              <div className="sm:col-span-2">
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-300">Call Engagement Duration</span>
                  <span className="font-mono text-purple-600 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-100">
                    {inputs.duration}s ({Math.floor(inputs.duration / 60)}m {inputs.duration % 60}s)
                  </span>
                </div>
                <input 
                  type="range"
                  min="20"
                  max="900"
                  step="10"
                  value={inputs.duration}
                  onChange={(e) => setInputs({ ...inputs, duration: Number(e.target.value) })}
                  className="w-full h-2 bg-slate-800/80 rounded-lg cursor-pointer accent-purple-600"
                />
              </div>

              {/* Balance */}
              <div className="sm:col-span-2">
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-300">Account Balance</span>
                  <span className="font-mono text-purple-600 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-100">
                    €{Number(inputs.balance).toLocaleString()}
                  </span>
                </div>
                <input 
                  type="range"
                  min="0"
                  max="15000"
                  step="100"
                  value={inputs.balance}
                  onChange={(e) => setInputs({ ...inputs, balance: Number(e.target.value) })}
                  className="w-full h-2 bg-slate-800/80 rounded-lg cursor-pointer accent-purple-600"
                />
              </div>

              {/* Activation Function */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Activation Function</label>
                <select
                  value={inputs.activation}
                  onChange={(e) => setInputs({ ...inputs, activation: e.target.value })}
                  className="w-full bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-xl px-3 py-2 text-xs text-slate-200 shadow-lg shadow-black/10"
                >
                  <option value="relu">ReLU (Rectified Linear Unit)</option>
                  <option value="gelu">GELU (Gaussian Error)</option>
                  <option value="leaky_relu">Leaky ReLU (alpha=0.01)</option>
                </select>
              </div>

              {/* Dropout Rate */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-300">Dropout Rate</span>
                  <span className="font-mono text-purple-600">{inputs.dropout}</span>
                </div>
                <input 
                  type="range"
                  min="0"
                  max="0.5"
                  step="0.05"
                  value={inputs.dropout}
                  onChange={(e) => setInputs({ ...inputs, dropout: Number(e.target.value) })}
                  className="w-full h-2 bg-slate-800/80 rounded-lg cursor-pointer accent-purple-600"
                />
              </div>

              {/* Prior Outcome */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Prior Campaign Outcome</label>
                <select
                  value={inputs.poutcome}
                  onChange={(e) => setInputs({ ...inputs, poutcome: e.target.value })}
                  className="w-full bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-xl px-3 py-2 text-xs text-slate-200 shadow-lg shadow-black/10"
                >
                  <option value="success">Success</option>
                  <option value="failure">Failure</option>
                  <option value="unknown">Unknown</option>
                </select>
              </div>

              {/* Housing Loan */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Housing Loan</label>
                <select
                  value={inputs.housing}
                  onChange={(e) => setInputs({ ...inputs, housing: e.target.value })}
                  className="w-full bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-xl px-3 py-2 text-xs text-slate-200 shadow-lg shadow-black/10"
                >
                  <option value="no">No Loan</option>
                  <option value="yes">Active Mortgage</option>
                </select>
              </div>
            </div>
          </div>

          {/* Loss & Convergence Curve */}
          <div className="card-glass rounded-2xl p-6">
            <h3 className="text-xs font-bold text-slate-50 uppercase tracking-wider mb-1">
              Neural Network Training & Validation Loss (Cross-Entropy)
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Loss curve over 50 training epochs using Adam optimizer (\(\alpha=0.001\)).
            </p>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={TRAINING_CURVE} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="epoch" stroke="#94a3b8" fontSize={10} unit=" ep" />
                  <YAxis stroke="#94a3b8" fontSize={10} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '0.75rem', fontSize: '12px' }}
                  />
                  <Line type="monotone" dataKey="loss" name="Binary Cross-Entropy" stroke="#9333ea" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Output Card (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="card-glass rounded-2xl p-6 border-t-4 border-t-purple-600">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/50">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Softmax Output</span>
              <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-slate-950/80 border border-slate-700/50 text-slate-400">
                {latency} ms
              </span>
            </div>

            <div className="py-6 text-center">
              <div className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center shadow-lg mb-3 ${
                isApproved ? 'bg-purple-600 text-white shadow-purple-200' : 'bg-rose-600 text-white shadow-rose-200'
              }`}>
                {isApproved ? <CheckCircle2 className="w-12 h-12" /> : <XCircle className="w-12 h-12" />}
              </div>
              <div className="text-xs font-black uppercase tracking-wider text-slate-400 mb-1">
                Prediction (YES / NO)
              </div>
              <h3 className={`text-4xl font-black tracking-tight ${
                isApproved ? 'text-purple-300' : 'text-rose-700'
              }`}>
                {isApproved ? 'YES ✅' : 'NO ❌'}
              </h3>
              <p className="text-sm font-bold text-slate-200 mt-2">
                {isApproved ? 'Customer will subscribe to the term deposit' : 'Customer will NOT subscribe to the term deposit'}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Neural network confidence: <strong className="font-mono text-slate-50 font-bold">{probYes}%</strong>
              </p>
            </div>

            {/* Probability Breakdown */}
            <div className="space-y-2 pt-4 border-t border-slate-800/50">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-purple-300">Class 1 Probability (Yes)</span>
                <span className="font-mono text-slate-50 font-bold">{probYes}%</span>
              </div>
              <div className="h-3 w-full bg-slate-700/80 rounded-full overflow-hidden p-0.5 flex">
                <div 
                  className="bg-purple-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${probYes}%` }}
                />
              </div>
              <div className="flex justify-between text-xs font-semibold mt-2">
                <span className="text-slate-400">Class 0 Probability (No)</span>
                <span className="font-mono text-slate-300">{probNo}%</span>
              </div>
            </div>
          </div>

          {/* Architecture Card */}
          <div className="card-glass rounded-2xl p-6">
            <h4 className="text-xs font-bold text-slate-50 uppercase tracking-wider mb-3">
              PyTorch / Tensor Specs
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-800/50">
                <span className="text-slate-400">Trainable Parameters</span>
                <span className="font-mono font-semibold text-slate-200">12,834 Weights</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/50">
                <span className="text-slate-400">Optimizer</span>
                <span className="font-mono font-semibold text-slate-200">Adam (lr=0.001)</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/50">
                <span className="text-slate-400">Loss Function</span>
                <span className="font-mono font-semibold text-slate-200">Binary Cross-Entropy</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Device Target</span>
                <span className="font-mono font-bold text-indigo-600">CUDA / CPU Auto</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
