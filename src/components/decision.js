'use client'

import { useState, useMemo, useRef, useCallback } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { toPng } from 'html-to-image'
import { jsPDF } from 'jspdf'
import { Award, PlusCircle, BarChart2, Download, ClipboardList, Layers, TrendingUp, Moon, Sun, Trash2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { useTheme } from "next-themes"
import {
  calculateOptimisticCriterion,
  calculatePessimisticCriterion,
  calculateHurwiczCriterion,
  calculateEqualLikelihoodCriterion,
  calculateSavageCriterion,
  criteriaNames,
} from '@/utils/decisionCriteria'

const AdvancedDecisionMaker = () => {
  const [projectName, setProjectName] = useState('Yatırım Karar Analizi')
  const [decisionCriterion, setDecisionCriterion] = useState('optimistic')
  const [alternatives, setAlternatives] = useState([
    { id: 1, name: 'Alternatif 1', values: [100, 150, 120] }
  ])
  const [stateCount, setStateCount] = useState(3)
  const [alphaValue, setAlphaValue] = useState(0.5)

  const reportRef = useRef(null)
  const { setTheme, theme } = useTheme()

  const addAlternative = () => {
    setAlternatives([
      ...alternatives, 
      { 
        id: alternatives.length + 1, 
        name: `Alternatif ${alternatives.length + 1}`, 
        values: Array(stateCount).fill(0)
      }
    ])
  }

  const updateAlternative = (id, field, value) => {
    setAlternatives(alternatives.map(alt => 
      alt.id === id 
        ? field === 'name' 
          ? { ...alt, name: value } 
          : { ...alt, values: alt.values.map((v, i) => i === parseInt(field) ? parseFloat(value) || 0 : v) }
        : alt
    ));
  }
  

  const removeAlternative = (id) => {
    setAlternatives(alternatives.filter(alt => alt.id !== id))
  }

  const calculateResults = useMemo(() => {
    switch (decisionCriterion) {
      case 'optimistic':
        return calculateOptimisticCriterion(alternatives)
      case 'pessimistic':
        return calculatePessimisticCriterion(alternatives)
      case 'hurwicz':
        return calculateHurwiczCriterion(alternatives, alphaValue)
      case 'equalLikelihood':
        return calculateEqualLikelihoodCriterion(alternatives)
      case 'savage':
        return calculateSavageCriterion(alternatives)
      default:
        return []
    }
  }, [alternatives, decisionCriterion, alphaValue])

  const chartData = useMemo(() => 
    alternatives.map((alt, index) => ({
      name: alt.name,
      score: calculateResults[index]
    }))
  , [alternatives, calculateResults])
  const exportToPDF = useCallback(async () => {
    if (reportRef.current === null) {
      console.error('Rapor referansı boş')
      return
    }
  
    const loadingOverlay = document.createElement('div');
    loadingOverlay.style.position = 'fixed';
    loadingOverlay.style.top = '0';
    loadingOverlay.style.left = '0';
    loadingOverlay.style.width = '100vw';
    loadingOverlay.style.height = '100vh';
    loadingOverlay.style.backgroundColor = '#020817';
    loadingOverlay.style.display = 'flex';
    loadingOverlay.style.justifyContent = 'center';
    loadingOverlay.style.alignItems = 'center';
    loadingOverlay.style.zIndex = '9999';
    
    loadingOverlay.innerHTML = `
      <div style="
        padding: 20px;
        border-radius: 10px;
        text-align: center;
        background-color:white;
        color:black;
        box-shadow: -1px 2px 8px 10px #0e142;
      " class="dark:text-white text-black dark:bg-card">
        <div style="font-size: 24px; margin-bottom: 15px;">📄 PDF İndiriliyor...</div>
        <div style="color: #666;">Lütfen bekleyiniz</div>
      </div>
    `;
    
    document.body.appendChild(loadingOverlay);
    
  
    try {
      const originalStyles = {
        position: reportRef.current.style.position,
        left: reportRef.current.style.left,
        top: reportRef.current.style.top,
        margin: reportRef.current.style.margin,
        transform: reportRef.current.style.transform
      }
  
      reportRef.current.style.position = 'relative'
      reportRef.current.style.left = '0'
      reportRef.current.style.top = '0'
      reportRef.current.style.margin = '0'
      reportRef.current.style.transform = 'none'
  
      const dataUrl = await toPng(reportRef.current, { 
        quality: 1, 
        pixelRatio: 2,
        cacheBust: true,
        skipAutoScale: true,
        width: reportRef.current.scrollWidth,
        height: reportRef.current.scrollHeight
      })
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })
  
      const imgProps = pdf.getImageProperties(dataUrl)
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width
  
      pdf.addImage(
        dataUrl, 
        'PNG', 
        0,    
        0,    
        pdfWidth, 
        pdfHeight, 
        undefined, 
        'FAST'
      )
  
      reportRef.current.style.position = originalStyles.position
      reportRef.current.style.left = originalStyles.left
      reportRef.current.style.top = originalStyles.top
      reportRef.current.style.margin = originalStyles.margin
      reportRef.current.style.transform = originalStyles.transform
  
      pdf.save(`${projectName}_${criteriaNames[decisionCriterion]}_raporu.pdf`)
  
    } catch (error) {
      console.error('PDF oluşturma hatası:', error)
      alert('PDF oluşturulurken bir hata meydana geldi. Lütfen tekrar deneyin.')
    } finally {
      document.body.removeChild(loadingOverlay)
    }
  }, [projectName, decisionCriterion])

  return (
    <div className="min-h-screen bg-background">
      <div ref={reportRef} className="max-w-4xl mx-auto bg-card text-card-foreground shadow-2xl rounded-2xl overflow-hidden">
        <div className="bg-primary text-primary-foreground p-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h1 className="text-3xl font-extrabold flex items-center">
                <Award className="mr-3 text-yellow-300" />
                Karar Destek Sistemi
              </h1>
              <p className="mt-2 text-primary-foreground/80">Profesyonel Analiz Raporu</p>
            </div>
            <div className="mt-4 md:mt-0 text-right">
              <Input 
              disabled
                className="bg-transparent border-b border-primary-foreground text-primary-foreground placeholder-primary-foreground/50 text-2xl font-bold"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Proje Adı"
              />
              <Select value={decisionCriterion} onValueChange={setDecisionCriterion}>
                <SelectTrigger className="mt-2 bg-primary-foreground/20 dark:bg-card dark:text-white text-primary-foreground">
                  <SelectValue placeholder="Karar Kriteri" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(criteriaNames).map(([value, name]) => (
                    <SelectItem key={value} value={value}>{name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="p-6">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Layers className="mr-2 text-primary" /> 
                Karar Matrisi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Alternatif</TableHead>
                      {Array.from({ length: stateCount }, (_, i) => (
                        <TableHead key={i}>Durum {i + 1}</TableHead>
                      ))}
                      <TableHead>İşlemler</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {alternatives.map((alt) => (
                      <TableRow key={alt.id}>
                        <TableCell>
                          <Input
                            value={alt.name}
                            onChange={(e) => updateAlternative(alt.id, 'name', e.target.value)}
                            placeholder="Alternatif Adı"
                          />
                        </TableCell>
                        {alt.values.map((value, index) => (
                          <TableCell key={index}>
                            <Input
                              type="number"
                              value={value}
                              onChange={(e) => updateAlternative(alt.id, index.toString(), e.target.value)}
                              placeholder={`Durum ${index + 1}`}
                            />
                          </TableCell>
                        ))}
                        <TableCell>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => removeAlternative(alt.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="flex justify-between mt-4">
                <Button onClick={addAlternative}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Alternatif Ekle
                </Button>
                <div className="flex items-center space-x-2">
                  <span>Durum Sayısı:</span>
                  <Input
                    type="number"
                    value={stateCount}
                    onChange={(e) => {
                      const newCount = parseInt(e.target.value) || 1
                      setStateCount(newCount)
                      setAlternatives(alternatives.map(alt => ({
                        ...alt,
                        values: Array(newCount).fill(0).map((_, i) => alt.values[i] || 0)
                      })))
                    }}
                    className="w-20"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {decisionCriterion === 'hurwicz' && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Hurwicz Alfa Değeri</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <Slider
                    value={[alphaValue]}
                    onValueChange={(value) => setAlphaValue(value[0])}
                    max={1}
                    step={0.01}
                    className="flex-grow"
                  />
                  <span className="font-bold">{alphaValue.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 text-primary" /> 
                Sonuçlar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Sıra</TableHead>
                        <TableHead>Alternatif</TableHead>
                        <TableHead>Puan</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {chartData.sort((a, b) => b.score - a.score).map((data, index) => (
                        <TableRow key={data.name} className={index === 0 ? 'bg-primary/20' : ''}>
                          <TableCell className="text-center">{index + 1}</TableCell>
                          <TableCell>{data.name}</TableCell>
                          <TableCell className="text-center font-bold">{data.score.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData.sort((a, b) => b.score - a.score)}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="score" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="bg-muted p-4 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground mb-4 md:mb-0">
            © {new Date().getFullYear()} Karar Destek Sistemi
          </p>
          <div className="flex items-center space-x-4">
            <Button 
              onClick={exportToPDF}
              className="flex items-center"
            >
              <Download className="mr-2" /> PDF Raporu İndir
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              {theme === "light" ? <Moon className="h-[1.2rem] w-[1.2rem]" /> : <Sun className="h-[1.2rem] w-[1.2rem]" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdvancedDecisionMaker

