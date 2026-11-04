import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import {
  TrendingUp,
  Users,
  Building2,
  PieChart,
  BarChart3,
  Sparkles,
  ShieldCheck,
  Filter,
  Layers,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';
import { ProductiveWaqfAsset, CashWaqfProgram, Language } from '../../types';

interface WaqfImpactDashboardProps {
  productiveAssets: ProductiveWaqfAsset[];
  programs: CashWaqfProgram[];
  language?: Language;
  onSelectAsset?: (asset: ProductiveWaqfAsset) => void;
}

interface SectorImpact {
  category: string;
  shortLabel: string;
  beneficiaries: number;
  netYield: number;
  valuation: number;
  assetCount: number;
  color: string;
}

export const WaqfImpactDashboard: React.FC<WaqfImpactDashboardProps> = ({
  productiveAssets,
  programs: _programs,
  onSelectAsset
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeAssetId, setActiveAssetId] = useState<string | null>(
    productiveAssets.length > 0 ? productiveAssets[0].id : null
  );

  // SVG Chart Refs
  const donutChartRef = useRef<SVGSVGElement | null>(null);
  const barChartRef = useRef<SVGSVGElement | null>(null);
  const valuationChartRef = useRef<SVGSVGElement | null>(null);

  // Aggregated Sector Impact Data
  const sectorData: SectorImpact[] = useMemo(() => {
    const palette = [
      '#059669', // Emerald - Kesehatan
      '#0d9488', // Teal - Pendidikan
      '#3b82f6', // Blue - Gedung Dakwah
      '#f59e0b', // Amber - Ritel
      '#8b5cf6', // Purple - Agribisnis
    ];

    const categoryMap: { [cat: string]: { beneficiaries: number; netYield: number; valuation: number; count: number } } = {};

    productiveAssets.forEach(asset => {
      if (!categoryMap[asset.category]) {
        categoryMap[asset.category] = { beneficiaries: 0, netYield: 0, valuation: 0, count: 0 };
      }
      categoryMap[asset.category].beneficiaries += asset.beneficiariesServed;
      categoryMap[asset.category].netYield += asset.annualNetYield;
      categoryMap[asset.category].valuation += asset.valuationAmount;
      categoryMap[asset.category].count += 1;
    });

    const entries = Object.entries(categoryMap);
    return entries.map(([cat, data], idx) => {
      let shortLabel = cat;
      if (cat.includes('Kesehatan')) shortLabel = 'Kesehatan';
      else if (cat.includes('Pendidikan')) shortLabel = 'Pendidikan';
      else if (cat.includes('Gedung')) shortLabel = 'Dakwah & AUM';
      else if (cat.includes('Ritel')) shortLabel = 'Ritel & Usaha';
      else if (cat.includes('Agribisnis')) shortLabel = 'Agribisnis';

      return {
        category: cat,
        shortLabel,
        beneficiaries: data.beneficiaries,
        netYield: data.netYield,
        valuation: data.valuation,
        assetCount: data.count,
        color: palette[idx % palette.length],
      };
    });
  }, [productiveAssets]);

  // Filtered Assets
  const filteredAssets = useMemo(() => {
    if (selectedCategory === 'all') return productiveAssets;
    return productiveAssets.filter(a => a.category === selectedCategory);
  }, [productiveAssets, selectedCategory]);

  const selectedAsset = useMemo(() => {
    return productiveAssets.find(a => a.id === activeAssetId) || productiveAssets[0] || null;
  }, [productiveAssets, activeAssetId]);

  // Aggregate Total Metrics
  const totalBeneficiaries = useMemo(() => {
    return productiveAssets.reduce((sum, a) => sum + a.beneficiariesServed, 0);
  }, [productiveAssets]);

  const totalYield = useMemo(() => {
    return productiveAssets.reduce((sum, a) => sum + a.annualNetYield, 0);
  }, [productiveAssets]);

  const totalValuation = useMemo(() => {
    return productiveAssets.reduce((sum, a) => sum + a.valuationAmount, 0);
  }, [productiveAssets]);

  const avgYieldPercentage = useMemo(() => {
    if (productiveAssets.length === 0) return '0';
    const sum = productiveAssets.reduce((acc, a) => acc + a.yieldPercentage, 0);
    return (sum / productiveAssets.length).toFixed(1);
  }, [productiveAssets]);

  // -------------------------------------------------------------
  // D3 Chart 1: Donut Chart of Beneficiaries by Sector
  // -------------------------------------------------------------
  useEffect(() => {
    if (!donutChartRef.current || sectorData.length === 0) return;

    const svg = d3.select(donutChartRef.current);
    svg.selectAll('*').remove();

    const width = 360;
    const height = 300;
    const radius = Math.min(width, height) / 2 - 20;
    const innerRadius = radius * 0.58;

    const g = svg
      .attr('viewBox', `0 0 ${width} ${height}`)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    const pie = d3
      .pie<SectorImpact>()
      .value(d => d.beneficiaries)
      .sort(null)
      .padAngle(0.03);

    const arc = d3
      .arc<d3.PieArcDatum<SectorImpact>>()
      .innerRadius(innerRadius)
      .outerRadius(radius)
      .cornerRadius(6);

    const arcHover = d3
      .arc<d3.PieArcDatum<SectorImpact>>()
      .innerRadius(innerRadius - 2)
      .outerRadius(radius + 8)
      .cornerRadius(6);

    const arcs = g
      .selectAll('.arc')
      .data(pie(sectorData))
      .enter()
      .append('g')
      .attr('class', 'arc')
      .style('cursor', 'pointer');

    arcs
      .append('path')
      .attr('d', arc as any)
      .attr('fill', d => d.data.color)
      .attr('opacity', 0.9)
      .style('transition', 'all 0.25s ease-out')
      .on('mouseenter', function () {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('d', arcHover as any)
          .attr('opacity', 1);
      })
      .on('mouseleave', function () {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('d', arc as any)
          .attr('opacity', 0.9);
      })
      .on('click', (_, d) => {
        setSelectedCategory(d.data.category);
      });

    // Center Display Element
    const centerGroup = g.append('g').attr('text-anchor', 'middle');

    centerGroup
      .append('text')
      .attr('dy', '-0.4em')
      .attr('class', 'text-xs font-semibold fill-slate-500 dark:fill-slate-400')
      .text('Total Penerima');

    centerGroup
      .append('text')
      .attr('dy', '0.9em')
      .attr('class', 'text-base font-black font-mono fill-slate-900 dark:fill-white')
      .text(`${(totalBeneficiaries / 1000).toFixed(1)}k Jiwa`);

  }, [sectorData, totalBeneficiaries]);

  // -------------------------------------------------------------
  // D3 Chart 2: Grouped Bar Chart of Gross Income vs Net Yield
  // -------------------------------------------------------------
  useEffect(() => {
    if (!barChartRef.current || productiveAssets.length === 0) return;

    const svg = d3.select(barChartRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 25, right: 20, bottom: 65, left: 75 };
    const width = 640;
    const height = 300;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg
      .attr('viewBox', `0 0 ${width} ${height}`)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const assetsToDisplay = filteredAssets.length > 0 ? filteredAssets : productiveAssets;

    const x0 = d3
      .scaleBand()
      .domain(assetsToDisplay.map(d => d.assetCode))
      .rangeRound([0, innerWidth])
      .paddingInner(0.25);

    const keys = ['annualGrossIncome', 'annualNetYield'];
    const x1 = d3
      .scaleBand()
      .domain(keys)
      .rangeRound([0, x0.bandwidth()])
      .padding(0.1);

    const maxVal = d3.max(assetsToDisplay, d => Math.max(d.annualGrossIncome, d.annualNetYield)) || 100000000000;

    const y = d3
      .scaleLinear()
      .domain([0, maxVal * 1.1])
      .nice()
      .rangeRound([innerHeight, 0]);

    // Grid lines
    g.append('g')
      .attr('class', 'grid')
      .attr('opacity', 0.1)
      .call(
        d3
          .axisLeft(y)
          .ticks(5)
          .tickSize(-innerWidth)
          .tickFormat(() => '')
      );

    // X Axis
    const xAxis = g
      .append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x0));

    xAxis.selectAll('text')
      .attr('transform', 'rotate(-15)')
      .attr('text-anchor', 'end')
      .attr('class', 'text-[10px] font-mono fill-slate-500 dark:fill-slate-400')
      .text((d: any) => {
        const item = assetsToDisplay.find(a => a.assetCode === d);
        if (!item) return d;
        return item.name.length > 18 ? item.name.slice(0, 16) + '...' : item.name;
      });

    xAxis.select('.domain').attr('stroke', '#94a3b8').attr('stroke-width', 0.5);

    // Y Axis with Indonesian Miliar formatting
    const yAxis = g.append('g').call(
      d3.axisLeft(y).ticks(5).tickFormat((d: any) => `Rp ${(d / 1000000000).toFixed(0)}M`)
    );

    yAxis.selectAll('text').attr('class', 'text-[10px] font-mono fill-slate-500 dark:fill-slate-400');
    yAxis.select('.domain').attr('stroke', '#94a3b8').attr('stroke-width', 0.5);

    // Color map for keys
    const color = d3.scaleOrdinal<string>()
      .domain(keys)
      .range(['#3b82f6', '#059669']); // Gross: Blue, Yield: Emerald

    // Render Bar Groups
    const assetGroups = g
      .append('g')
      .selectAll('g')
      .data(assetsToDisplay)
      .enter()
      .append('g')
      .attr('transform', d => `translate(${x0(d.assetCode)},0)`)
      .style('cursor', 'pointer')
      .on('click', (_, d) => {
        setActiveAssetId(d.id);
        if (onSelectAsset) onSelectAsset(d);
      });

    keys.forEach(key => {
      assetGroups
        .append('rect')
        .attr('x', x1(key)!)
        .attr('y', innerHeight)
        .attr('width', x1.bandwidth())
        .attr('height', 0)
        .attr('fill', color(key))
        .attr('rx', 3)
        .attr('opacity', 0.9)
        .transition()
        .duration(600)
        .delay((_, i) => i * 80)
        .attr('y', d => y((d as any)[key]))
        .attr('height', d => innerHeight - y((d as any)[key]));
    });

  }, [productiveAssets, filteredAssets, onSelectAsset]);

  // -------------------------------------------------------------
  // D3 Chart 3: Valuation Breakdown (Horizontal Divergent / Ranked Bar)
  // -------------------------------------------------------------
  useEffect(() => {
    if (!valuationChartRef.current || productiveAssets.length === 0) return;

    const svg = d3.select(valuationChartRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 90, bottom: 30, left: 160 };
    const width = 640;
    const height = 260;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg
      .attr('viewBox', `0 0 ${width} ${height}`)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const sortedAssets = [...productiveAssets].sort((a, b) => b.valuationAmount - a.valuationAmount);

    const y = d3
      .scaleBand()
      .domain(sortedAssets.map(d => d.name))
      .rangeRound([0, innerHeight])
      .padding(0.28);

    const maxVal = d3.max(sortedAssets, d => d.valuationAmount) || 350000000000;
    const x = d3
      .scaleLinear()
      .domain([0, maxVal * 1.08])
      .range([0, innerWidth]);

    // Bars
    const barGroups = g
      .selectAll('.val-bar')
      .data(sortedAssets)
      .enter()
      .append('g')
      .attr('class', 'val-bar')
      .style('cursor', 'pointer')
      .on('click', (_, d) => {
        setActiveAssetId(d.id);
        if (onSelectAsset) onSelectAsset(d);
      });

    barGroups
      .append('rect')
      .attr('y', d => y(d.name)!)
      .attr('height', y.bandwidth())
      .attr('x', 0)
      .attr('width', 0)
      .attr('fill', (d, i) => (d.id === activeAssetId ? '#059669' : i % 2 === 0 ? '#0d9488' : '#0284c7'))
      .attr('rx', 4)
      .attr('opacity', 0.88)
      .transition()
      .duration(700)
      .attr('width', d => x(d.valuationAmount));

    // Value Labels on the right of bars
    barGroups
      .append('text')
      .attr('y', d => y(d.name)! + y.bandwidth() / 2 + 3.5)
      .attr('x', d => x(d.valuationAmount) + 8)
      .attr('class', 'text-[11px] font-bold font-mono fill-slate-700 dark:fill-slate-300')
      .text(d => `Rp ${(d.valuationAmount / 1000000000).toFixed(0)} M (${d.yieldPercentage}%)`);

    // Y Axis with names
    const yAxis = g.append('g').call(d3.axisLeft(y));
    yAxis.selectAll('text')
      .attr('class', 'text-[11px] font-medium fill-slate-700 dark:fill-slate-300')
      .text((d: any) => (d.length > 22 ? d.slice(0, 20) + '...' : d));
    yAxis.select('.domain').attr('stroke', 'transparent');
    yAxis.selectAll('.tick line').attr('stroke', 'transparent');

  }, [productiveAssets, activeAssetId, onSelectAsset]);

  return (
    <div className="space-y-6">
      
      {/* Header & Badges */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-2xl text-white shadow-md">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-[10px] font-bold tracking-wider uppercase text-emerald-300 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-emerald-300" />
              <span>D3.js Vector Analytics Engine</span>
            </span>
            <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] font-mono text-slate-300">
              Live Real-Time Waqf Impact
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Waqf Impact Dashboard & Visualisasi Pendayagunaan
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl mt-1 leading-relaxed">
            Transparansi penuh penyaluran surplus wakaf produktif (RS PKU, Universitas, Surya Mart, Menara Dakwah) langsung kepada mustahik dan mauquf 'alaih berbasis bukti on-chain.
          </p>
        </div>

        {/* Global Filter by Sector */}
        <div className="flex items-center gap-2 self-start md:self-auto shrink-0 bg-white/10 backdrop-blur-xs p-1.5 rounded-xl border border-white/15">
          <Filter className="w-3.5 h-3.5 text-emerald-300 ml-1.5" />
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="bg-transparent text-xs font-semibold text-white focus:outline-hidden pr-2 cursor-pointer"
          >
            <option value="all" className="bg-slate-900 text-white">Semua Sektor Aset</option>
            {sectorData.map(s => (
              <option key={s.category} value={s.category} className="bg-slate-900 text-white">
                {s.shortLabel} ({s.assetCount} Aset)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 4 Impact Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1">
            <span>Mauquf 'Alaih Terbantu</span>
            <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black font-mono text-slate-900 dark:text-white tabular-nums">
            {totalBeneficiaries.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Pasien Dhuafa & Santri Binaan</span>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1">
            <span>Surplus Bersih Manfaat (Yield)</span>
            <TrendingUp className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black font-mono text-emerald-700 dark:text-emerald-400 tabular-nums">
            Rp {(totalYield / 1000000000).toFixed(1)} M
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Disalurkan 100% Sesuai Ikrar Wakaf
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1">
            <span>Valuasi Portofolio Wakaf</span>
            <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black font-mono text-blue-600 dark:text-blue-400 tabular-nums">
            Rp {(totalValuation / 1000000000000).toFixed(2)} T
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Standar BWI & IFRS Syariah
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1">
            <span>Rerata Efisiensi Imbal Hasil</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl sm:text-2xl font-black font-mono text-amber-600 dark:text-amber-400 tabular-nums">
            {avgYieldPercentage}% / Th
          </div>
          <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium mt-1 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            <span>Audit Wajar Tanpa Pengecualian</span>
          </div>
        </div>

      </div>

      {/* Main Charts Grid: Left Donut Sector (5 Cols) & Right Grouped Bar (7 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: D3 Donut Chart - Mauquf 'Alaih Distribution */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <PieChart className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  Distribusi Penerima Manfaat per Sektor
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold">
                D3.js Donut
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Arahkan kursor pada busur grafik untuk menganalisis porsi kuota mustahik di tiap sektor pendayagunaan.
            </p>

            {/* SVG Canvas */}
            <div className="flex justify-center my-2">
              <svg ref={donutChartRef} className="w-full max-w-[320px] h-[260px] overflow-visible"></svg>
            </div>
          </div>

          {/* Interactive Legend List */}
          <div className="space-y-1.5 pt-3 border-t border-slate-100 dark:border-slate-800">
            {sectorData.map(s => {
              const isSelected = selectedCategory === s.category;
              const pct = ((s.beneficiaries / totalBeneficiaries) * 100).toFixed(1);
              return (
                <div
                  key={s.category}
                  onClick={() => setSelectedCategory(selectedCategory === s.category ? 'all' : s.category)}
                  className={`flex items-center justify-between p-2 rounded-lg text-xs cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }}></span>
                    <span className="font-medium text-slate-800 dark:text-slate-200 truncate">
                      {s.shortLabel}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 font-mono">
                    <span className="font-bold text-slate-900 dark:text-white">
                      {s.beneficiaries.toLocaleString('id-ID')} jiwa
                    </span>
                    <span className="text-slate-400 text-[11px]">({pct}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: D3 Grouped Bar Chart - Gross Income vs Net Yield */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  Perbandingan Pendapatan Bruto vs Surplus Bersih Wakaf (Yield)
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-semibold">
                D3.js Grouped Bar
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              Performa finansial unit usaha wakaf produktif Muhammadiyah dalam menghasilkan surplus berkesinambungan.
            </p>

            {/* Legend for Bars */}
            <div className="flex items-center gap-4 text-xs mb-3">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-blue-500"></span>
                <span className="text-slate-600 dark:text-slate-400">Gross Income (Omset Operasional)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-emerald-600"></span>
                <span className="text-slate-600 dark:text-slate-400 font-bold">Net Yield (Surplus Hak Mustahik)</span>
              </div>
            </div>

            {/* SVG Canvas */}
            <div className="w-full overflow-x-auto no-scrollbar">
              <svg ref={barChartRef} className="w-full min-w-[500px] h-[280px] overflow-visible"></svg>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800 mt-2 flex items-center justify-between">
            <span>* Klik batang grafik untuk menyorot kartu akuntabilitas aset terkait</span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
              Kadar Bagi Hasil 100% Syariah
            </span>
          </div>
        </div>

      </div>

      {/* Ranked Asset Valuation Chart & Active Asset Detail Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Ranked Valuation Horizontal Bar Chart (7 Cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-teal-600" />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                Peringkat Valuasi Wajar Aset & Efisiensi Imbal Hasil
              </h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 font-semibold">
              D3.js Horizontal Bar
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
            Akumulasi nilai kapital aset wakaf tanah dan bangunan di bawah naungan BPH & Majelis Pendayagunaan Wakaf.
          </p>

          <div className="w-full overflow-x-auto no-scrollbar">
            <svg ref={valuationChartRef} className="w-full min-w-[480px] h-[250px] overflow-visible"></svg>
          </div>
        </div>

        {/* Right: Selected Asset Transparency Card (5 Cols) */}
        {selectedAsset && (
          <div className="lg:col-span-5 bg-gradient-to-br from-white via-slate-50 to-emerald-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-emerald-950/20 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300">
                  {selectedAsset.assetCode}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
                  {selectedAsset.status.toUpperCase()}
                </span>
              </div>

              <h4 className="font-bold text-base text-slate-900 dark:text-white leading-snug">
                {selectedAsset.name}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {selectedAsset.location} · {selectedAsset.branchPwm}
              </p>

              {/* Asset Highlight Stats */}
              <div className="grid grid-cols-2 gap-2.5 my-4">
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60">
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Nilai Valuasi Aset</div>
                  <div className="text-sm font-bold font-mono text-slate-900 dark:text-white mt-0.5">
                    Rp {(selectedAsset.valuationAmount / 1000000000).toFixed(1)} Miliar
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60">
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Surplus Net Yield / Th</div>
                  <div className="text-sm font-bold font-mono text-emerald-700 dark:text-emerald-400 mt-0.5">
                    Rp {(selectedAsset.annualNetYield / 1000000000).toFixed(2)} Miliar
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60">
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Penerima Manfaat Langsung</div>
                  <div className="text-sm font-bold font-mono text-indigo-700 dark:text-indigo-400 mt-0.5">
                    {selectedAsset.beneficiariesServed.toLocaleString('id-ID')} Jiwa
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60">
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Tingkat Imbal Hasil</div>
                  <div className="text-sm font-bold font-mono text-amber-600 dark:text-amber-400 mt-0.5">
                    {selectedAsset.yieldPercentage}% / Tahun
                  </div>
                </div>
              </div>

              {/* Nazhir & Blockchain Proof Tag */}
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-emerald-900 dark:text-emerald-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                  <span>Nazhir Resmi Terverifikasi BWI</span>
                </div>
                <div className="text-[11px] text-slate-600 dark:text-slate-300">
                  {selectedAsset.nazhirName} ({selectedAsset.nazhirRegistrationNo})
                </div>
                <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 truncate pt-1 border-t border-emerald-200/60 dark:border-emerald-800/40">
                  Blok M-Chain: #{selectedAsset.blockchainRecord.blockNumber} · {selectedAsset.blockchainRecord.qrHash}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500 text-[11px]">Luas Tanah: {selectedAsset.landAreaM2.toLocaleString('id-ID')} m²</span>
              <button
                onClick={() => onSelectAsset && onSelectAsset(selectedAsset)}
                className="text-emerald-700 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1"
              >
                <span>Lihat Sertifikat Wakaf</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
