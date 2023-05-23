import { Configuration as ConfigurationUtil } from '../../../src/domain/util/configuration.util';
import { FMP as FMPService } from '../../../src/infrastructure/service/fmp.service';
import { ApiRest as ApiRestError429 } from '../util/api-rest.error429.util';

describe('Class FMP Service', () => {
  it('etfHolder - Happy Path', async () => {
    const fmp: FMPService = new FMPService(
      undefined,
      ConfigurationUtil.fmpApiKey()
    );
    const holders = await fmp.etfHolder('VOO,VIG');
    expect(Array.isArray(holders)).toBeTruthy();
    expect(holders.length).toBe(2);
    expect(holders[0].symbol).toBe('VIG');
    expect(Array.isArray(holders[0].holders)).toBeTruthy();
    expect(holders[0].holders.length).toBeGreaterThan(0);
    expect(holders[1].symbol).toBe('VOO');
    expect(Array.isArray(holders[1].holders)).toBeTruthy();
    expect(holders[1].holders.length).toBeGreaterThan(0);
  });
  it('profile - Happy Path 1', async () => {
    const fmp: FMPService = new FMPService(
      undefined,
      ConfigurationUtil.fmpApiKey()
    );
    const profiles = await fmp.profile('VOO,VIG');
    expect(Array.isArray(profiles)).toBeTruthy();
    expect(profiles.length).toBe(2);
    expect(profiles[0].symbol).toBe('VIG');
    expect(profiles[1].symbol).toBe('VOO');
  }, 10000);
  it('profile - Happy Path 2', async () => {
    const fmp: FMPService = new FMPService(
      undefined,
      ConfigurationUtil.fmpApiKey()
    );
    const profiles = await fmp.profile(
      'MSFT,AAPL,XOM,UNH,JNJ,JPM,PG,V,MA,HD,MRK,AVGO,PEP,KO,COST,CSCO,WMT,MCD,ACN,ABT,LIN,TXN,CMCSA,NKE,NEE,BMY,QCOM,ORCL,UPS,HON,INTU,LOW,UNP,SBUX,CAT,SPGI,GS,LMT,ELV,MDT,ADI,BLK,SYK,ADP,MMC,CB,ZTS,TGT,BDX,CME,ETN,ITW,NOC,AON,APD,CSX,CL,HUM,WM,KLAC,SHW,EMR,GD,PNC,MCK,APH,MCO,MSI,SRE,ROP,MCHP,ADM,TEL,ECL,AJG,TRV,CTAS,NUE,SYY,MET,HSY,LHX,XEL,PAYX,AFL,CMI,ROK,BK,AMP,RMD,PPG,GWW,FAST,WEC,ALL,AWK,RSG,STT,ES,DFS,GLW,TSCO,HPQ,ABC,ALB,WST,GPC,IFF,KR,HIG,CHD,DOV,DTE,MKC,CAH,CLX,STE,XYL,STLD,NDAQ,FITB,RJF,CMS,CINF,IEX,EXPD,BR,TSN,PFG,SJM,AES,DGX,FDS,ATO,RS,MKTX,JBHT,AVY,CBOE,BRO,LNT,POOL,HUBB,SNA,WRB,PKG,GGG,BAH,NDSN,SWK,BF-B,CSL,CHRW,DOX,HRL,TTC,RPM,JKHY,CE,SCI,TPL,WTRG,EMN,GL,LECO,HEI.A,RRX,ALLE,PNR,RNR,RGA,AOS,RHI,RGLD,AFG,CHDN,HII,LII,WSM,DCI,CHE,CASY,ATR,UNM,ITT,CBSH,CFR,HEI,LFUS,INGR,PRI,AIZ,MDU,LAD,PII,SON,BC,SEIC,ERIE,PB,IDA,AIT,RLI,ENSG,SSB,NFG,FLO,FIX,MORN,NJR,ASH,MSA,UFPI,POWI,PRGO,GBCI,ZION,SLGN,WTS,R,THG,NSP,THO,CBT,OGS,AXS,EVR,BCPC,HOMB,MAN,FFIN,LANC,WLK,GATX,OZK,FUL,FELE,AVNT,BMI,AWR,HI,CWT,SXT,ABM,INDB,AGO,SMG,CBU,MGEE,KWR,AUB,BRC,AEL,WDFC,BOKF,UMBF,CNO,MTRN,MGRC,SFNC,IBOC,CPK,JJSF,SCL,SJW,FRME,WOR,TRN,EMBC,TOWN,LNN,CNS,LKFN,WLY,SYBT,MNRO,GFF,NBTB,CHCO,BANF,TCBK,SXI,HMN,MSEX,AGM,TNC,ANDE,DDS,MATW,WABC,LBAI,LMAT,SBSI,GABC,APOG,HFWA,TR,TMP,SPTN,SRCE,HWKN,ATRI,YORW,PLOW,CASS,GRC,HVT,ARTNA,SCVL,THFF,HIFS,AAN,BMRC,SMBC,AMZN,NVDA,GOOGL,TSLA,BRK-B,GOOG,META,CVX,ABBV,LLY,PFE,TMO,BAC,CRM,DIS,ADBE,DHR,VZ,AMD,NFLX,PM,RTX,WFC,T,INTC,AMGN,COP,BA,IBM,PLD,MS,DE,GE,GILD,AMAT,BKNG,AXP,CVS,AMT,MDLZ,NOW,C,TJX,ISRG,REGN,PYPL,TMUS,PGR,VRTX,SCHW,MO,CI,SO,DUK,BSX,FISV,LRCX,SLB,EOG,EQIX,MU,ATVI,MPC,SNPS,ICE,FCX,CCI,MMM,CDNS,EL,HCA,VLO,FDX,ORLY,EW,GM,MRNA,GIS,USB,F,NXPI,PXD,NSC,PSA,CMG,PSX,DG,AEP,D,AZO,OXY,TFC,KMB,ADSK,DXCM,MAR,MSCI,PH,FTNT,CTVA,TT,ANET,JCI,IDXX,EXC,MNST,A,BIIB,O,DOW,NEM,TDG,CARR,PCAR,CHTR,AIG,HLT,IQV,YUM,SPG,STZ,HES,ILMN,ROST,COF,WMB,ON,OTIS,KMI,CNC,MTD,ED,WELL,AME,WBD,DD,DVN,FIS,CPRT,EA,PEG,ODFL,KHC,CTSH,DHI,APTV,PRU,GEHC,KDP,DLTR,VRSK,VICI,BKR,KEYS,ANSS,ENPH,OKE,HAL,CSGP,DLR,SBAC,ULTA,URI,EIX,ZBH,LEN,CDW,PCG,GPN,CEG,IT,TROW,ACGL,WBA,WTW,EFX,FANG,ALGN,FTV,EBAY,PWR,LYB,IR,AVB,CBRE,VMC,PODD,MPWR,DAL,AEE,EXR,ETR,MLM,WY,FE,FSLR,TDY,EQR,HPE,PPL,BAX,LH,MTB,ARE,HOLX,CTRA,LUV,OMC,VRSN,DRI,SWKS,TTWO,LVS,WAB,CNP,WAT,COO,NTRS,INVH,CAG,VTR,MAA,RF,FICO,EPAM,BALL,K,SEDG,TER,PKI,NVR,AMCR,TRGP,ZBRA,HBAN,MOH,MOS,FLT,HWM,GRMN,FMC,BBY,IRM,CFG,MRO,LW,TXT,TYL,J,PAYC,LKQ,BG,RCL,EXPE,IPG,UAL,MGM,CF,RE,ETSY,EVRG,NTAP,PTC,INCY,ESS,TRMB,PHM,SYF,STX,IP,UDR,LDOS,AKAM,PEAK,TFX,KIM,WDC,APA,KEY,DPZ,VTRS,BWA,TECH,CPT,CTLT,HST,EQT,WYNN,MAS,PARA,NI,CDAY,L,JNPR,CPB,HSIC,MTCH,CZR,CCL,QRVO,CRL,TPR,BIO,KMX,LYV,FOXA,GEN,TAP,AAL,REG,FFIV,PNW,ROL,NWSA,XRAY,UHS,BBWI,NRG,WRK,BXP,VFC,IVZ,BEN,FRT,WHR,AAP,HAS,GNRC,SEE,OGN,DXC,CMA,NCLH,ALK,MHK,RL,NWL,DVA,FOX,LNC,BX,UBER,PANW,ABNB,LULU,SNOW,WDAY,LNG,SQ,MRVL,WCN,CRWD,SGEN,TTD,VEEV,TEAM,APO,ALNY,HZNP,HUBS,DDOG,DASH,BMRN,SUI,NET,PINS,RBLX,LPLA,SPLK,ZM,MDB,PLTR,AVTR,BURL,OKTA,ARES,GDDY,DOCU,TWLO,SNAP,ZS,COIN,LBRDK,BSY,TW,ZI,U,BILL,BKI,ROKU,PLUG,Z,RIVN,MTN,IBKR,WMG,BF-A,CHWY,EDR,PATH,TOST,ZG,LBRDA,SIRI,2330,NESN,700,ASML,NOVO B,005930,MC,AZN,ROG,SHEL,9988,NOVN,7203,SAP,HSBA,RY,TTE,1299,SIE,SAN,6758,BP.,CBA,TD,DGE,6861,BHP,RELIANCE,ALV,SU,3690,UNA,BATS,ENB,8306,AIR,IBE,RIO,GLEN,CP,ZURN,GSK,CNR,4568,BNP,MBG,BAYN,4063,RMS,REL,INFY,VALE3,UBSG,CNQ,BNS,939,BMO,NAB,PRX,ABI,CS,HDFC,388,RKT,8035,IFX,SHOP,ABBN,9618,SAF,8316,WBC,4502,6501,NG.,9433,MUV2,BAS,6367,ENEL,ADYEN,KER,8031,RI,ANZ,ULVR,DPW,D05,LONN,CPG,7267,8001,BN,BBVA,INGA,1398,9888,8058,ISP,MQG,7974,2318,2317,SIKA,TCS,LLOY,TRP,1120,2454,NTR,WES,ATD,7741,9984,LSEG,STLAM,CM,CRHL,6098,NDA FI,BA.,000660,INVE B,8766,CSU,8411,DB1,NPN,UCG,ITX,3382,6954,BMW,DSV,005935,9432,MFC,6981,WDS,9983,STMPA,VOLV B,PDD,O39,ALC,AD,RACE,9999,4661,ATCO A,WKL,9434,WOW,ENI,AMS,EXPN,6273,006400,ADS,AMXB,SREN,CAP,TCL,VWS,U11,3988,BARC,1211,HOLN,HINDUNILVR,NOKIA,FNV,FERG,DSY,EOAN,SLF,VOW3,G,RWE,AHT,HEIA,1180,EQNR,SGO,VOD,4503,GIVN,051910,PETR4,IFC,2914,6902,GMAB,NBK,LR,GFNORTEO,CVE,6702,SSE,2222,NA,6594,AXISBANK,ITUB4,FMG,GMG,6503,AEM,ORA,ASSA B,SAND,5108,1810,6301,035420,BBRI,600519,KFH,SAMPO,2269,7733,2010,WPM,CLNX,BHARTIARTL,7751,9022,TEF,HEXA B,ML,EVO,IMB,2308,TRI,005490,8002,PGHN,EAND,WALMEX,1AE,NESTE,DBK,DSM,GIB.A,9987,QSR,FTS,3968,16,9020,9961,005380,HLN,8053,III,QNBK,PETR3,VIE,2303,REP,8591,5401,7010,GEBN,6752,UMG,KBC,SLHN,ASM,ABX,RTO,OR,DNB,4911,LT,2502,4901,STAN,UPM,2331,4452,8750,4543,SEB A,NWG,ERIC B,PUB,COLO B,LGEN,6723,ESSITY B,FEMSAUBD,ATCO B,8801,6857,KNEBV,6178,AMC,FSR,SWED A,2802,NIBE B,GLE,ICICIBANK,2020,1,7269,6326,823,BAJFINANCE,SCMN,PHIA,TECK.B,000270,ORSTED,4519,STMN,8113,SHL,6971,373220,386,WSP,EDP,RR.,COL,KRZ,ASIANPAINT,BMRI,1925,GMEXICOB,1024,NCM,4523,CNHI,CABK,HO,KNIN,SOON,QBE,27,NICE,MT,1303,MG,HCLTECH,BAER,CARL B,035720,FFH,669,SY1,2412,105560,6502,DTG,MONC,FER,Z74,8725,MAYBANK,AV.,TEP,STO,POW,ITC,AKZA,2881,8267,BCE,ACA,MTX,BBDC4,055550,8802,MARUTI,S32,6920,HEN3,7309,DANSKE,4578,2015,VNA,PTT-F,MRU,SUNPHARMA,M&M,2891,RHM,6762,SBK,SGSN,PBBANK,BEI,SJR.B,3711,291,068270,2882,BNZL,SHB A,TITAN,0R22,6869,EPI A,BT.A,BXB,NIO,2319,2002,7832,1109,TLKM,2057,857,WPP,8309,LISP,AI,B3SA3,4507,7182,BRBY,INF,ABEV3,8630,2628,SN.,CA,LISN,2886,BEKE,2503,GFI,SRG,9735,1113,TOU,2,WEGE3,1010,LUMI,BNR,HNR1,8604,IHG,KPN,TLS,SGRO,9101,1301,1216,2884,6506,1928,AENA,2388,PRY,BIMBOA,ALFA,POLI,CRDA,1088,207940,EMA,FRE,CCO,CBK,RPRX,CCEP,WSO,DELL,VST,EQH,FHN,CHK,BAP,FNF,OGE,EWBC,ALLY,UGI,NVT,ORI,WBS,NATI,SCCO,CG,DINO,JEF,NYCB,FAF,CHRD,OSK,CR,MUR,HRB,CIVI,HUN,ACI,DTM,M,UBSI,CC,FLS,SNV,COLB,HLI,OMF,LEG,POR,FNB,SWX,ONB,HE,AVT,PNM,WU,BPOP,BKH,VLY,MSM,MTG,WEN,CADE,TGNA,PINC,HP,FCFS,ALE,JHG,TRTN,PAG,SR,RDN,KMPR,AM,NWE,FL,HWC,AVA,TNL,SLM,UCBI,OTTR,AGR,JXN,KTB,FHB,SHOO,CCOI,SPB,FIBK,ASB,LCII,CRI,LAZ,CWEN,IGT,CBRL,KSS,ETRN,PIPR,CATY,ENR,CALM,KMT,PDCO,MDC,BLMN,PPBI,WD,FULT,CVBF,CRS,STRA,BOH,FBP,FFBC,NOG,APAM,AY,ZIM,WAFD,ARCH,EBC,GPS,DAN,BANR,KW,NUS,XRX,PRK,JACK,JWN,VGR,BKU,VIRT,WSBC,CAKE,OXM,NFE,RNST,IBTX,DK,GEF,NWN,NAVI,HTLF,TROX,REYN,ADT,TRMK,MLKN,NWBI,AROC,WMK,NTB,HEES,PFS,VRTS,WWW,HNI,STBA,UPBD,UVV,GOGL,CRBG,LZB,MATV,FCF,KALU,PACW,SFL,SBLK,TDS,BGS,SASR,CNA,HOPE,HCSG,EGBN,BHLB,EIG,GBX,MED,CVI,DIN,ARGO,EVA,BRKL,CWEN.A,WT,CFFN,MCY,SCS,TFSL,AMBP,SBGI,TSE,KAMN,TTEC,WASH,KRNY,CTBI,GES,RBCAA,FG,GIB/A,TCK.B,RCI.B,RBA,OTC,H,IMO,WN,TFII,GWO,ARX,CAE,CTC.A,CCL.B,IAG,GFL,GIL,AQN,FSV,X,LUN,IVN,ALA,AC,WFT,EMP.A,BEPC,QBR.B,FTT,CU,OCX,CAR.UN,NVEI,REI.UN,BLCO,PTM3 INDEX,BHP.AX,NOVN.SW,NESN.SW,MC.PA,SHEL.L,HSBA.L,TTE.PA,ROG.SW,RIO.L,MBG GR,CS.PA,CBA.AX,7203.T,DTE.DE,ALV.DE,AZN.L,BNP.PA,ULVR.L,OR.PA,BATS.L,HLAG GR,SAN.PA,ZURN.SW,BP-.L,9432.T,9434.T,BMW GR,GSK.L,NG-.L,ANZ.AX,NOVOB DC,NAB.AX,ENI.MI,ITX.MC,DBS SP,8306.T,WDS.AX,IBE.MC,STLAM.MI,ENGI.PA,ORA.PA,RIO.AX,16.HK,SAP.DE,9433.T,1299.HK,8058.T,ELE.MC,BAS.DE,AAL.L,DGE.L,8316.T,OCBC SP,8031.T,DPW GR,EQNR.OL,TLS.AX,WBC.AX,NDA.ST,ASML.AS,2914.T,4502.T,SCMN.SW,RBT.L,VOD.L,DG.PA,TEL.OL,BAYN.DE,BBVA.MC,SREN.SW,UOB SP,IMB.L,8766.T,SAN.MC,KBC BB,8035.T,RI.PA,4063.T,2388.HK,UBSG VX,SU.PA,TEF.MC,VOW.DE,ABBN.SW,MUV2 GR,NTGY.MC,RMS.PA,HOLN.SW,LLOY.L,EOAN GR,8053.T,REL.L,DNB.OL,MQG.AX,KER.PA,G.MI,SAMPO FH,7974.T,AI.PA,66.HK,8411.T,RITN.SW,8002.T,8001.T,7267.T,388.HK,ST SP,BN.PA,WES.AX,HEIA.AS,KNIN.SW,SWEDA.ST,SRG.MI,4519.T,823.HK,6178.T,5401.T,12.HK,AIR.PA,MAERSKB DC,RO.SW,GLE.PA,EL.PA,BARC.L,SSE.L,CRH ID,HNR1.DE,SHL GR,LGEN.L,CSL.AX,TSCO.L,6902.T,BA-.L,TRN.MI,AD.AS,ADS.DE,6501.T,7751.T,TELIA.ST,CABK.MC,BT-A.L,SEBA.ST,ABI BB,KNEBV FH,2.HK,TCL.AX,SGO.PA,SLHN.SW,HO.PA,11.HK,REP.MC,VOLVB.ST,EDP PL,5108.T,6301.T,PGHN.SW,6981.T,8725.T,FORTUM FH,COL.AX,ML.PA,AKERBP.OL,VIE.PA,1972.HK,3.HK,SGSN.SW,6954.T,WOW.AX,LUMI.TA,JMT PL,WIL SP,8630.T,PUB.PA,AV-.L,4503.T,3382.T,UMG.AS,CLI SP,OMV AV,6503.T,RWE.DE,SHBA.ST,WKL.AS,DB1.DE,STO.AX,1605.T,ORSTED DC,PRU.L,ERICB.ST,6752.T,8750.T,RACE.MI,COLOB DC,GIVN.SW,ATCOA.ST,LSE.L,CPG.L,NN.AS,HEIO.AS,1925.T,1928.T,NESTE FH,UPM FH,9983.T,4901.T,SAND.ST,HEN.DE,SIKA.SW,6367.T,LR.PA,CAP.PA,GEBN.SW,4452.T,ESSITYB.ST,2502.T,6273.T,PRX.AS,FER.MC,TRYG DC,6861.T,7832.T,IFX.DE,GMG.AX,669.HK,2503.T,ATCOB.ST,DBK.DE,CARLB DC,4578.T,ASSAB.ST,4568.T,8801.T,STAN.L,EVO.ST,AHT.L,6702.T,8267.T,VTWR GR,SOON.SW,CNHI.MI,DSFIR.AS,JDEP.AS,9735.T,9020.T,8802.T,7269.T,7270.T,4528.T,7741.T,4523.T,UCB BB,4507.T,ALL.AX,6762.T,7011.T,POLI.TA,EQT.ST,6098.T,EPIA.ST,HMN SP,NOVOB,NZYM B,PNDORA,TRYG,CHR,MAERSK B,SIM,RBREW,MAERSK A,DEMANT,JYSK,ZEAL,RILBA,GN,ISS,DNORD,SYDB,AMBU B,DKK,TOP,ROCK B,HLUN B,SPNO,NKT,ALMB,BAVA,DFDS,NETC,STG,ALK B,TRMD A,PAAL B,CHEMM,SOLAR B,MATAS,NTG,HLUN A,TRIFOR,NLFSK,CBRAIN,HBCFT,XTSLA,UHAL,OVV,SSNC,DRS,$USD,XPO,OC,TMHC,LPX,MTH,SEB,ESNT,TOL,MPW,WAL,QDEL,SWN,KNX,POST,PDCE,HTZ,RITM,FYBR,SM,MLI,OLN,ABG,BTU,ARW,SYNH,AMKR,CLF,PENN,AIRC,AN,AL,PBF,NXST,CUZ,DISH,STWD,BERY,SUM,JLL,PNFP,SIG,SNX,WTFC,LUMN,KRC,SSD,COKE,FBIN,GNW,SFM,COOP,BLD,CABO,TPH,MATX,KBH,BCC,MHO,ELAN,GPOR,GRBK,CRC,SF,RYI,WGO,STC,RC,IMKTA,CCS,NMIH,PRIM,UNFI,PFSI,GPI,ECPG,ENVA,PATK,USM,GT,MKSI,TKR,ATSG,HIW,AGCO,PK,PTVE,CPE,PVH,ASIX,LADR,RUSHA,CXW,GEO,FDP,UAA,VSH,HTLD,ASGN,VSCO,HCC,HUBG,AMR,SCHL,SANM,PDM,VSTO,TTMI,CHGG,LILAK,LGIH,NNI,VCTR,OFG,TCBI,MBUU,WERN,CNXC,TNET,SNDR,URBN,ARCB,OI,CACC,ABR,SKX,AAT,ODP,DNOW,REZI,NEU,NPO,JBGS,PGRE,LOB,VBTX,INT,MBIN,RH,CACI,FCNCA,FHI,KEX,ABCB,NMRK,EAF,BFH,VNT,STAG,BXMT,DCOM,GNTX,VRTV,DOC,OCFC,AX,PARR,NCR,PCH,HPP,LRN,AEIS,OMI,LEA,CASH,COHR,JBL,HELE,DFIN,AYI,DEI,PUMP,CMTG,AVNS,EVTC,AEO,IVT,MMI,MDRX,BNL,SYNA,EFSC,TRS,WSFS,HLF,MEI,ESRT,PRAA,CENTA,LXP,PRM,PLUS,CARG,BUSE,GNL,EYE,OSIS,CCSI,VSAT,THC,ECVT,PSMT,DEA,ROCK,EPC,EHC,SEM,PGTI,PBH,JBLU,KD,GBDC,MD,GHC,SLG,TREX,SITE,ENOV,CVCO,NTCT,SLVM,SNEX,APPS,UNF,GXO,GVA,FA,CCK,SBH,FBK,USFD,BJ,BHF,OBNK,COHU,TFIN,MIDD,FBNC,HR,IART,ENS,MAT,VNO,ESI,NVST,LEVI,NOV,ZD,RIG,CXT,NSIT,AMED,ITGR,TBBK,ICFI,LAUR,ALGT,SHYF,HAIN,ATUS,SUPN,CODI,EQC,DORM,MYRG,MWA,HTH,SBRA,SAFT,ALG,YELP,NHI,AKR,ACIW,UE,MOG/A,KFRC,PLXS,STEL,IDCC,RXO,SSTK,NBHC,SAH,UCTT,SBCF,RVLV,SMTC,N/A,KSPI,VCB,COMI,HPG,VHM,KAP,VIC,TLV,MSN,SNP,PFBCOLOM,IAM,ATW,BKMB,OTEL,STB,SSI,BCOLOMBIA,ISA,VRE,SNG,HSBK,SHB,NGN,DANGCEM,JOPT,VJC,SMPH,SQURPHARMA,SAB,JOPH,MTNN,VND,MSP,BDO,ARBK,SCOM,LBV,EAST,BRD,CSR,ABUK,ALBH,DGC,IGN1L,BID,KDH,ICT,GTCO,ZENITHBANK,OMR,GRUPOARGOS,ORDS,BPI,KDC,EGR1T,HRHO,BVN,VCI,BEXIMCO,NVL,NESTLE,IDC,LHV1T,GEX,ALI,ENGRO,VHC,RON,HUBC,BXPHARMA,SBT,JGS,MBT,SYS,FBNH,CEMARGOS,ACCESSCORP,NBOB,PVS,VCG,BVH,JFC,PVD,DPM,VPI,LUCK,KCB,MAD,NLG,URC,GAS,LHBL,BCP,BEACONPHAR,BATBC,SAB1L,MNG,ROBI,POSR,POL,HSG,OGDC,UBA,HPS,JOIB,AEV,MPI,DXG,MARI,SHS,TRG,JKH.N0000,DGW,CAPL,PDR,UBL,TAL1T,FFC,EFERT,HBL,MER,SGAFT,SECB,JOEP,RENATA,MCB,RCR,LTG,OLYMPIC,RNSS,GTCAP,PGOLD,GP,BRACBANK,EUR,MTL,DMC,JOD,PKR,WLCON,TSM1T,IFIC,PSO,MONDE,AGI,CITYBANK,CNPF,PHP,CNVRG,NBL,EXPO.N0000,SAMP.N0000,SUMITPOWER,BLOOM,COMB.N0000,BHD,EGP,KES,JPMSW,RLC,ITHMR,BDT,LKR,ACEN,BKMBOM,MEG,TSM,CPALL-F,ULTRACEMCO,TATASTEEL,2688,1288,HTHT,6160,ANG,5871,9633,EMAAR,NTPC,1060,SBIN,SQM-B,DELTA-F,688,2892,2899,ELET3,QIBK,2885,POWERGRID,NESTLEIND,5880,AOT-F,JSWSTEEL,ITSA4,RENT3,TECHM,1093,CEMEXCPO,ALPHADHABI,ASII,CIMB,2313,2382,CEZ,2601,1326,1150,BDMS-F,GRASIM,6618,1101,6690,2880,SOL,IMP,TATAMOTORS,3008,4013,HINDALCO,175,2327,2328,300750,1171,ADVANC-F,ONGC,GAPB,TENAGA,2207,ADCB,OTP,BBAS3,1658,GULF-F,2883,2357,BRITANNIA,ADANIPORTS,1801,2887,ASURB,3037,UMC,DMART,2379,2890,PTTEP-F,1590,HDFCLIFE,SHP,BAJAJFINSV,3034,VIPS,9868,ADANIENT,267,SSW,SUZB3,1050,3045,6030,CPN-F,SBILIFE,2345,788,CIPLA,IQCD,1605,168,9626,5876,8069,1177,CBQK,000858,TATACONSUM,960,1140,APOLLOHOSP,9901,2603,3800,2301,968,RADL3,20,6415,GOTO,TME,2395,MARK,NED,EICHERMOT,COALINDIA,2082,2912,EQTL3,GGBR4,LTIM,ITUB,KBANK-F,BVT,5110,SCB-F,DRREDDY,601318,YMM,1919,BBNI,RAIL3,UPL,JBSS3,4938,1080,ALDAR,PCHEM,WIPRO,BPAC11,3328,CHT,DIVISLAB,MDKA,SCC-R,PIDILITIND,BBSE3,GODREJCP,3888,ADANIGREEN,SHREECEM,2474,3529,GFINBURO,CHILE,KOFUBL,DIB,SRF,2333,7020,PRIO3,BPCL,268,VEDL,914,384,836,ADIB,1402,FUNO11,BEL,MAXHEALTH,3231,4904,998,6862,IOC,PMETAL,TATAPOWER,DABUR,916,6505,2280,1099,APN,3323,HEROMOTOCO,CHOLAFIN,1066,2801,6409,2888,2609,SIEMENS,2310,CRC-F,SHRIRAMFIN,ZAIN,AMRT,BBDC3,6488,BH-F,MINT-F,CSAN3,601888,2007,TUPRS.E,CLS,SIMEPLT,YESBANK,HAVELLS,NAUKRI,COPEC,VBL,BIMAS.E,THYAO.E,1102,EA-F,241,2324,KCHOL.E,EUROB,2202,3908,ELEKTRA,WHL,CDB,ZOMATO,INDHOTEL,8210,1193,GAIL,ADNOCDIST,BAJAJ.AXTO,VIVT3,881,2377,SISE.E,DEWA,HTO,1476,1044,RDOR3,IHH,VBBR3,LREN3,ASAI3,CMIG4,6669,2356,AGLTY,2290,ICICIGI,IQ,322,6770,QIIK,OMAB,2409,3443,1339,ADANITRANS,AXIATA,MARICO,1209,AMBUJACEM,TATAMTRDVR,TRENT,9688,MYTIL,OPAP,TIINDIA,600309,MULTIPLY,NPH,270,2618,4002,OMU,600036,6186,HYPE3,UNTR,ATGL,HLBANK,RICHTER,390,9910,CPF-F,1816,CCRO3,135,3481,5347,MISC,CIB,GRUMAB,INDIGO,TAL,002594,MRF,2347,QFLS,AKBNK.E,3661,PERSISTENT,RNI,1504,DLF,PAGEIND,MCDOWELL-N,ENKAI.E,9904,NRP,PTTGC-F,5483,9945,PIIND,CUMMINSIND,TVSMOTOR,601398,KLBF,DQ,CHDRAUIB,KLBN11,ETE,200596,2353,QGTS,YUMC,2344,ALPHA,BBAJIOO,SBICARD,JINDALSTEL,5274,MOL,586,4743,000568,603259,1585,6837,CGPOWER,2338,CENCOSUD,BZ,3898,9926,4190,PPB,FEDERALBNK,EREGL.E,TATAELXSI,EXX,KOMB,600809,ENEV3,BRK/B,KKR,MKL,WPC,VMW,HEI/A,BF/B,SPOT,ICLR,TRU,FWONK,OWL,GRAB,LSXMK,LEN/B,LCID,BF/A,GFS,FWONA,LSXMA,S32.AX,9101.T,6.HK,9104.T,ACS.MC,KPN.AS,ICL.TA,EBS AV,RAND.AS,AGS BB,PST.MI,83.HK,OCI.AS,SGP.AX,CT SP,BAER.SW,O2D.DE,EN.PA,TLX.DE,A17U SP,17.HK,8.HK,HEI.DE,5020.T,NHY.OL,US.MI,APA.AX,MRL.MC,DWS GR,MB.MI,ELISA FH,5713.T,SSABB.ST,HELN.SW,JCNC SP,9107.T,BALN.SW,YAR.OL,REE.MC,DXS.AX,8309.T,EVK.DE,LI.PA,SHL.AX,101.HK,ORG.AX,8015.T,SBRY.L,GBLB BB,ASRNL.AS,BCVN.SW,VIV.PA,SCG.AX,ENG.MC,6146.T,WCH.DE,ASX.AX,MZTF.TA,ABF.L,TEL2B.ST,RXL.PA,INW.MI,TOP DC,GJF.OL,SN-.L,SOLB BB,8604.T,CA.PA,MAP.MC,MINT SP,FDJ.PA,8473.T,GALP PL,BESI.AS,9503.T,KEP SP,STE SP,SGX SP,BOL.ST,IG.MI,6988.T,ALD.AX,BXB.AX,ALD.PA,GFC.PA,STJ.L,NXT.L,8308.T,2768.T,AGN.AS,FLT SP,8601.T,2269.T,4188.T,7202.T,UU-.L,JBH.AX,5201.T,BAMI.MI,A2A.MI,BNZL.L,PNDORA DC,1878.T,QBE.AX,MPL.AX,MCT SP,SGRO.L,LOG.MC,1911.T,7272.T,MOWI.OL,IHG.L,4042.T,SCHN.SW,7259.T,LAND.L,SUN.AX,SVT.L,BMED.MI,KGF.L,SDR.L,MLT SP,19.HK,VCX.AX,9531.T,BG AV,ALFA.ST,ANDR AV,FGR.PA,SKG ID,ANA.MC,5019.T,NHC.AX,CCH.L,5802.T,WHC.AX,PROX BB,9502.T,5334.T,VOLVA.ST,SALM.OL,3407.T,IPL.AX,SKFB.ST,MGR.AX,4324.T,6857.T,8795.T,1802.T,VALMT FH,VEA.AX,VPK.AS,VOE AV,MONC.MI,BKT.MC,STERV FH,BRBY.L,SPSN.SW,8953.T,9143.T,AM.PA,AAF.L,HVN.AX,OLG SP,4005.T,1812.T,BNR.DE,ITV.L,REC.MI,COFB BB,4704.T,KESKOB FH,SGE.L,OSB.L,ORK.OL,MNDI.L,MOCORP FH,TPG.AX,SUN SP,PSPN.SW,6701.T,GPT.AX,VACN.SW,BVI.PA,FBK.MI,ENX.PA,NST.AX,6806.T,3231.T,BGN.MI,SMDS.L,BLND.L,GENS SP,EDV.L,8697.T,3003.T,ACX.MC,RHM.DE,5333.T,UHR.SW,FNTN.DE,AZJ.AX,SCHP.SW,KREIT SP,SW.PA,LATOB.ST,DSCT.TA,7181.T,4183.T,ROTH.PA,EDV.AX,AGL.AX,7261.T,AKE.PA,SIGN.SW,3402.T,14.HK,SCI SP,BKW.SW,MTS.AX,4732.T,1801.T,6302.T,87.HK,G1A.DE,RUI.PA,4021.T,DKSH.SW,BWY.L,9021.T,2587.T,AXFO.ST,2588.HK,LOGN.SW,HER.MI,SAB.MC,7912.T,SOL.AX,HUSQB.ST,GALE.SW,6305.T,UTG.L,TIETO FH,2897.T,HL-.L,FRES.L,SZU.DE,BSL.AX,HPOLB.ST,HOT.DE,2267.T,CIT SP,9684.T,FIE.DE,UNI.MI,ITRK.L,6506.T,1808.T,INVP.L,3291.T,2651.T,AZRG.TA,VONN.SW,CTPNV.AS,GCO.MC,SECUB.ST,5901.T,SMIN.L,6753.T,CRDA.L,5021.T,INDUA.ST,PRY.MI,CPU.AX,BEZQ.TA,TKA AV,ERG.MI,3405.T,MTX.DE,NVG PL,MELE BB,UHRN.SW,INCH.L,DCC.L,EFGN.SW,DRX.L,LIGHT.AS,4716.T,GAW.L,ACE.MI,WOR.AX,RTO.L,AMOT.TA,BEN.AX,REA.AX,FCT SP,SBMO.AS,CAR.AX,GTT.PA,9532.T,COH.AX,9766.T,4768.T,IAG.AX,TWE.AX,PUM GR,23.HK,10.HK,8410.T,ALLN.SW,BVIC.L,7186.T,WDP BB,HWDN.L,6724.T,8830.T,VIG AV,NETLINK SP,3635.T,4204.T,UMI BB,3436.T,NEC.AX,AIBG ID,PHOE1.TA,VRLA.PA,FTIN.TA,ASM.AS,COL.MC,ORNBV FH,DLG.MI,4739.T,7735.T,6963.T,LSG.OL,6460.T,SIX2 GR,SAVE.ST,CHR DC,BBOX.L,9697.T,6471.T,STB.OL,ELIS.PA,WTB.L,VIS.MC,7013.T,4536.T,8331.T,SDF.AX,ELI BB,COLR BB,RBREW DC,2784.T,9364.T,9147.T,SEK.AX,6965.T,NZYMB DC,FDR.MC,VMS SP,3092.T,EPIB.ST,7752.T,6361.T,AZA.ST,6113.T,1414.T,CPR.MI,SVW.AX,BBY.L,ERA.PA,4403.T,BYG.L,2778.HK,SRBANK.OL,9719.T,DIE BB,KESKOA FH,8060.T,PSON.L,EVN AV,MF.PA,SPX.L,4091.T,SPIE.PA,8354.T,BEZ.L,BOQ.AX,9042.T,3626.T,RF.PA,ALQ.AX,SAX GR,AKER.OL,9142.T,BZU.MI,THULE.ST,TE.PA,4182.T,CNA.L,SCAB.ST,9064.T,REH.AX,SFSN.SW,TRELB.ST,LDO.MI,FABG.ST,BKW.AX,2809.T,6504.T,SWECB.ST,GF.SW,ILU.AX,MIN.AX,SRAIL.SW,8804.T,RS1.L,LIFCOB.ST,KSP ID,INDUC.ST,3288.T,5332.T,8304.T,NK.PA,IPN.PA,SXS.L,3289.T,AUTO.L,2670.T,CMBN.SW,7701.T,2579.T,8227.T,HBR.L,CCC.L,BPE.MI,BOSS.DE,7167.T,9831.T,1803.T,NHF.AX,BRE.MI,AED BB,AALB.AS,3088.T,4927.T,6383.T,9513.T,TATE.L,6417.T,IMCD.AS,GET.PA,CHC.AX,PMV.AX,GLB ID,3116.T,SOP.PA,CD SP,2433.T,BIM.PA,CIE.MC,7731.T,ORI.AX,CTEC.L,METSB FH,6481.T,5101.T,3861.T,6448.T,1721.T,ARCAD.AS,RCO.PA,IMI.L,2801.T,INDT.ST,CLN.SW,DLN.L,AFX.DE,WEIR.L,8252.T,RMV.L,3086.T,ASHG.TA,6370.T,TEMN.SW,WIE AV,2002.T,HUH1V FH,4088.T,BILL.ST,MMB.PA,NDA.DE,8369.T,2331.T,PNN.L,9005.T,7459.T,FR.PA,KOG.OL,SAABB.ST,UOL SP,CGF.AX,QUB.AX,WWASA.OL,ESLT.TA,4922.T,AMP.MI,ROVI.MC,BB.PA,9989.T,4516.T,OERL.SW,7453.T,4004.T,G24 GR,7012.T,3774.T,STRS.TA,BC8.DE,ENOG.L,6952.T,5110.T,DOW.AX,2181.T,KOJAMO FH,HOLMB.ST,2875.T,6268.T,6028.T,6841.T,UNI.MC,4506.T,6976.T,SAGAB.ST,ROR.L,2282.T,UTDI.DE,HLMA.L,AAK.ST,9962.T,NEX.PA,IGO.AX,ANN.AX,4751.T,RSW.L,ACKB BB,BIRGI IX,ALHE.TA,IEL.AX,3391.T,6845.T,4613.T,SFER.MI,SYAB GR,EBRO.MC,2371.T,SDF.DE,DIA.MI,5714.T,DOCS.L,DPLM.L,SWAV,IRDM,SAIA,APLS,EME,TXRH,INSP,CROX,KNSL,RXDX,KRTX,RBC,WING,ITCI,AQUA,ADC,SIGI,LNTH,NOVT,LNW,EXLS,MUSA,SPSC,CELH,OPCH,CMC,RMBS,MEDP,CHX,ISEE,GTLS,ATKR,MTDR,MMS,RHP,BRBR,SMCI,TRNO,ATI,ALKS,ASO,APG,FOXF,AJRD,DEN,EXPO,MMSI,ELF,WK,KRG,SLAB,CWST,WFRD,HALO,QLYS,AAON,HQY,BIPC,ONTO,HAE,TGTX,FLR,TENB,IRTC,PTCT,SKY,MDGL,ACLS,PCVX,DIOD,IRT,HGV,VC,AMN,BOX,CNMD,NEOG,PECO,ARWR,FN,ALTR,EPRT,TWNK,LTHM,MGY,ENV,ALIT,ADNT,VAL,STAA,SMPL,HL,BDC,JBT,STNE,BLKB,MSTR,BECN,MODG,TEX,CYTK,NTLA,APLE,FSS,FOLD,MTSI,DUOL,NE,IBP,FOCS,BPMC,SHLS,BL,EVH,AIN,ARRY,WIRE,NARI,BE,PACB,SPXC,RETA,BCO,CVLT,SONO,ESGR,RVNC,DNLI,INSM,FWRD,ZWS,OFC,NGVT,KOS,KLIC,APPF,IPAR,RPD,DY,THS,OMCL,AXNX,HRI,CALX,PGNY,VRNS,RRR,LIVN,ACAD,ITRI,IOSP,PD,CNX,ESE,AVAV,HLNE,PZZA,KFY,VRNT,CBZ,OUT,PR,PRMW,PRGS,ARNC,VRRM,STNG,GMS,PRFT,SITC,WHD,RCM,SAGE,AMBA,SFBS,CEIX,BOOT,ALRM,MAC,SPT,GLNG,KAI,PTEN,DOCN,AXSM,TMDX,SEAS,NUVA,FTDR,HASI,ATRC,HLIO,PRTA,B,PCRX,RVMD,SHO,VIAV,FCPT,SHAK,FORM,THRM,CSWI,GKOS,EXTR,DOOR,SGRY,SKT,INSW,BEAM,PEB,TDW,IIPR,CNK,SAVE,CTRE,GPRE,FRO,CORT,DBRG,PI,RIOT,ATGE,STR,MXL,MQ,VIR,KRYS,SITM,MYGN,BMBL,HURN,GOLF,CRVL,DRH,NEO,CERE,CSTM,EAT,RELY,CWK,FSLY,CPRX,PHR,AUPH,XNCR,NOVA,PJT,AGYS,LBRT,YOU,SILK,ACVA,KTOS,VCYT,OII,SDGR,FLYW,XPEL,AKRO,RLJ,CSGS,TGH,RAMP,XPRO,ROIC,PRVA,FGEN,PRG,AMRC,NEX,BGCP,ELME,MGPI,LAZR,SKYW,VCEL,ADUS,OEC,ALEX,AMLX,KAR,AMEH,ABCL,BBIO,JOE,PSN,BCRX,EPAC,PLAY,RDNT,CLDX,GTY,AMPH,BATRK,KN,IRWD,APPN,BORR,BRP,HIMS,SUMO,ARI,SVC,TRUP,XHR,MNTV,DVAX,DHT,EVRI,HLIT,COUR,NVEE,MGNI,TWO,QTWO,ENVX,WNC,NG,SABR,PLMR,MORF,DICE,ERII,CTS,LTC,MRTN,CARS,UTZ,STEP,ACLX,AVTA,ARVN,SNDX,CTKB,AGIO,CIM,USPH,ZIP,FIZZ,CNNE,JELD,LGND,ASAN,INFN,DNUT,PTGX,LGF/B,PAYO,CDMO,HSKA,TA,DO,PDFS,IRBT,IMGN,HLMN,PMT,RADI,CHEF,MOD,ZETA,PRO,UPWK,MODN,ROAD,AVDX,DDD,CRNX,MARA,CRNC,CMP,MIR,GSHD,KYMR,AMSF,STRL,SPWR,MFA,VRDN,GERN,JOBY,AIV,ATEC,ANF,EVBG,MGI,MCRI,NXT,CWEN/A,NYMT,FBRT,HLX,UTL,PRA,RCKT,FLNG,TALO,ZUO,NVRO,VECO,HRMY,WRBY,MLAB,DGII,CYRX,PWSC,MNKD,UFPT,OM,IOVA,JBSS,CRK,VICR,NTST,SLCA,ASTE,BKE,SKIN,ZNTL,TTGT,TMCI,KDNY,CMCO,VTYX,NXGN,FIGS,NSSC,NXRT,SQSP,TVTX,AVID,FORG,CMPR,COMM,RLAY,RGR,ETWO,WINA,YEXT,AZZ,PLL,NBR,MODV,CDE,RCUS,TNK,ATEN,SHEN,FNA,IMAX,UEC,PEBO,CRDO,ICHR,GDEN,IMXI,RTL,AHCO,INDI,RKLB,NUVL,FRG,GDOT,MRC,KROS,USNA,SCHN,TMST,SPNT,SGH,SAFE,CWH,CCRN,PRCT,RPT,UUUU,TBPH,MSGE,OSTK,IMVT,KIDS,PL,DRQ,VERV,SIBN,LZ,PRDO,JBI,ADPT,AMWD,SPHR,BYND,IDYA,REPL,NABL,SMP,LTH,DCPH,ACT,LPRO,CHCT,BSIG,ACCD,SWTX,THR,EXPI,INBX,SPCE,COLL,BJRI,AXL,PLYM,EFC,FCEL,STKL,CCF,ARR,AHH,INVA,NHC,PLAB,BHE,RDFN,CAL,ROCC,ADEA,UNIT,RGNX,RNA,ZGN,OSCR,SAVA,OSW,BHVN,PAR,PRLB,BKD,PTLO,VTLE,UMH,GTN,RXRX,DCO,HCAT,RICK,ARCT,SATS,NRC,TITN,SG,CLNE,ATEX,NWLI,ARQT,CLW,PBI,BRMK,HAYN,CHS,HY,SLP,SNCY,MYE,DCGO,CHUY,CEVA,VSEC,HOUS,TGI,CRAI,ENTA,PNT,OPK,AMBC,ESMT,FLNC,TRNS,KOP,FDMT,COMP,IONQ,COGT,RILY,DLX,ESTE,TELL,VZIO,OFIX,ASC,BDN,GSAT,HZO,ETD,AVXL,LC,CBL,VREX,BALY,LFST,BZH,BANC,LGF/A,AMRK,LXU,PFBC,CUBI,QCRH,COCO,AVPT,HSTM,NAPA,SXC,ADTN,INN,ADMA,OLO,UFCS,AMPL,RWT,KREF,KURA,FLGT,LPG,SPNS,BRY,SOVO,JRVR,DX,GOGO,HIBB,MTW,DENN,IAS,NIC,OSPN,PCT,NX,LICY,THRY,XPOF,GDYN,DSEY,IE,BXC,SCSC,NAT,UDMY,CRSR,CNDT,GIII,ALHC,ARKO,TWST,BLFS,DM,ACRS,FBMS,SP,EGLE,AMK,BBSI,SWBI,ALKT,MCFT,GEF/B,EBS,BOWL,ATNI,AGX,VVX,XMTR,AORT,MIRM,KE,SANA,ME,FPI,INST,HSII,AVO,HCKT,MNTK,BOC,VTOL,TBI,TWI,VPG,EBIX,ASLE,OSUR,HTBK,MRSN,TPIC,IIIV,NFBK,EWCZ,CTIC,ACCO,CVGW,FMBH,CAC,CNXN,RES,SCLX,BBUC,AMWL,RGP,CIR,LUNG,AMCX,LASR,LXFR,ACEL,CYH,UVE,FARO,CENX,REPX,INTA,PFC,FATE,MBWM,CNOB,PGC,TRST,MDXG,GCO,CMRE,BFS,ACRE,DBI,AMOT,VMEO,CSTL,LAND,SRI,BIGC,CRMT,HA,NNOX,MCS,AMTB,CFB,ALLO,ANIP,UHT,SLGC,QNST,CDRE,FMNB,BY,KELYA,OIS,GPRO,AGEN,CLFD,DOMO,MXCT,ORGN,GOOD,AGTI,CRGY,EB,ACMR,NRIX,BTAI,CLBK,GMRE,QTRX,SHCR,KNTK,RPAY,BLUE,GSBC,IIIN,ANAB,CHRS,AVD,PUBM,CDNA,ZEUS,SNBR,EBF,HAFC,SWI,MGNX,DXPE,OCUL,MTTR,ALEC,BASE,GNK,RUTH,NSTG,HCCI,WSR,LWLG,KBAL,STEM,REX,STGW,ROVR,MBI,BLX,BFC,BRSP,LMND,ARLO,MSBI,AOSL,TRTX,EZPW,FC,EGY,IDT,EDIT,WTTR,RXST,SD,HSC,TILE,OSBC,CCBG,CLDT,VTNR,DHIL,UVSP,WW,RAPT,SSP,NWPX,IBRX,HOV,MPB,EBTC,SSTI,BLBD,TH,VVI,OABI,HCI,GCI,BFST,ASPN,CDLX,CPF,ALX,RYAM,IVR,TPC,CTOS,MCRB,MVIS,PAHC,AMAL,QUOT,RMAX,BHB,GIC,GLDD,ONEW,JOUT,TWOU,CNSL,ESQ,KRUS,BOOM,MLNK,WSBF,CSV,CUTR,POWL,OPY,MPLN,FFIC,LPSN,MOV,BAND,AMSWA,RUSHB,OPRX,SB,NVTA,TARS,HDSN,ABUS,SBOW,GLRE,MCBS,QRTEA,AVIR,EE,WRLD,DXLG,BLNK,FISI,PLPC,BHR,ICPT,NKLA,LEU,DYN,CVLG,CPSI,CCNE,XPER,RLGT,PHAT,BIG,REVG,EGRX,NR,ACNB,KPTI,JANX,CCB,SMRT,CTLP,CZNC,SIGA,CMTL,EGHT,MITK,SFIX,ONL,AROW,ATRA,DAWN,LQDT,XERS,HBNC,LOVE,SMR,AXGN,RMR,STRO,ACDC,SMBK,IESC,DFH,WTI,CDXS,FNKO,DSKE,IPI,MOFG,ULCC,LILA,ACHR,BATRA,INDT,SENS,OLP,FSBC,ANIK,FFWM,CERS,STER,AVNW,FCBC,TK,PKE,FRPH,IBCP,SENEA,IRMD,PFIS,ZYXI,EOLS,ONTF,INSE,OFLX,TIPT,HTBI,FWRG,NTGR,FORR,VITL,DJCO,FMAO,LIND,OOMA,SLDP,VNDA,HIPO,OPI,FOR,NPK,EQRX,NRDS,DNMR,TCMD,USLM,TG,UTMD,SRDX,PETS,EQBK,ANGO,PSTL,ATRO,CARE,IHRT,EVC,EVCM,BFLY,EWTX,MYPS,INGN,PETQ,MCBC,PNTG,ITOS,CLSK,CENT,CTO,LYEL,TTI,PSFE,EVLV,AMNB,ORC,LQDA,EVGO,CSTR,CGEM,BBW,BW,HONE,TRC,PWP,CLAR,WTBA,PLCE,AMPS,CATC,GCMG,CVT,ALTG,ZUMZ,MLR,PTRA,TSVT,CLOV,KNSA,TPB,DHC,CIVB,BLFY,ACET,STKS,SPIR,TCBX,CANO,FLL,RLYB,CMBM,BH,PBFS,BNGO,CRBU,STOK,BWB,GLUE,AXTI,NREF,TDUP,SCU,FSP,REAL,HLVX,PACK,OCGN,HEAR,SPWH,APEI,GEVO,FHTX,ATLC,SPFI,SCWX,HNST,NGVC,MASS,VLD,FULC,GWH,BSRR,AFCG,ZIMV,FF,MVST,NC,VERI,GBIO,EYPT,HPK,INNV,BLDE,NRGV,CCCC,AKTS,AOMR,NEXT,DOUG,ILPT,HMST,YMAB,RSI,VUZI,BV,VXRT,LL,WKHS,ENFN,DSGR,SNPO,AADI,NKTX,CSTE,ARIS,IGMS,SOI,HUMA,DIBS,MKFG,GLT,UTI,HYLN,NDLS,JMSB,NN,SEER,BWFG,WULF,LOCO,GOSS,RENT,PLM,COOK,CMRX,CPSS,UNTY,WISH,NUTX,LFCR,MPX,ALTO,BRCC,FRBA,SHBI,ATHA,MLYS,NOTV,ITIC,ALPN,LEGH,APLD,PMVP,LXRX,JYNT,KODK,BIRD,AVTE,BCBP,RBB,NKTR,FTCI,FRST,NBN,OTLK,VLGEA,SFST,HRT,ORGO,DMRC,NGM,CIO,KZR,OPRT,AMRX,PLBY,FVCB,TNGX,RBOT,GNTY,PCB,ICVX,FNLC,SKWD,BRT,HFFG,FUBO,GPMT,PCYO,EP,TCX,INBK,IBEX,BBCP,HRTX,VERU,RIDE,PRME,ORRF,NRDY,MAX,CRGE,PKBK,ALXO,MVBF,MULN,EVER,FBIZ,METC,SGMO,GCBC,HLLY,INVE,CATO,LTCH,VRAY,RM,ALCO,CRD/A,SKIL,FEAM,GRWG,GAMB,NGMS,GOEV,VCSA,URG,KOD,RDVT,CARA,DHX,HT,AKYA,KALV,AEVA,ADV,HBCP,HBT,RSVR,NODK,UPLD,DTC,PGEN,WEYS,DC,STRS,FREE,DSGN,CBAN,AMRS,LAW,OUST,BHIL,QSI,GWRS,PVBC,SKYT,USCB,UFI,STHO,TTSH,NAUT,TLYS,WLDN,FLIC,NUVB,PRPL,SEAT,AFMD,TREE,SLQT,ERAS,SAMG,MPAA,ULH,UEIC,AURA,ESPR,QUAD,CTRN,TSP,REI,SGC,POWW,INO,TYRA,DZSI,TNYA,KRT,FOSL,KNTE,THRX,BLND,SGHT,PTSI,ATOM,DGICA,BCML,CBNK,XXII,CIFR,CNTY,LBC,VERA,ALRS,MYFW,MGTX,PEPG,RIGL,PRTS,NATR,FLWS,WEAV,ALVR,BRBS,OB,UIS,LE,RMNI,SWIM,CMAX,RRBI,EHTH,KRO,BGFV,NETI,RCKY,BARK,AMPY,BCOV,ACRV,RBBN,SKLZ,EGAN,SMMF,TRUE,RAD,GIB,LSCC,ENTG,MANH,OTEX,DT,CGNX,PCTY,WEX,CIEN,DSGX,PSTG,GWRE,WOLF,OLED,NTNX,DBX,SMAR,EEFT,AZPN,DLB,CRUS,FIVN,ESTC,IAC,NEWR,TDC,IPGP,PCOR,FOUR,S,CFLT,LITE,DV,W,ALGM,AYX,AFRM,FRSH,RNG,BB,XM,APP,PEGA,TRIP,NCNO,GTLB,LSPD,TIXT,PYCR,PLTK,JAMF,TWKS,WFFUT,RXT,NLY,AGNC,AJX,REFI,MLPFT,TNOTE,WIT,TBOND,GVMXX,CPALL.R,AOT.R,PTT.R,BDMS.R,ADVANC.R,SCC.R,DELTA.R,PTTEP.R,GULF.R,BH.R,CPN.R,EA.R,MINT.R,TRUE.R,PTTGC.R,SCB.R,INTUCH.R,HMPRO.R,LH.R,CRC.R,CPF.R,KBANK.R,BANPU.R,BEM.R,OR.R,KTB.R,BTS.R,TOP.R,IVL.R,SCGP.R,THB,KTC.R,BJC.R,GPSC.R,OSP.R,AWC.R,EGCO.R,RATCH.R,TU.R,SAWAD.R,WHA.R,BGRIM.R,BCP.R,BCH.R,AP.R,KCE.R,SPALI.R,IRPC.R,CENTEL.R,JMT.R,THG.R,MTC.R,BAM.R,HANA.R,CK.R,SIRI.R,CBG.R,PLANB.R,RAM.R,AMATA.R,STA.R,QH.R,TOA.R,CHG.R,BTG.R,SPRC.R,AEONTS.R,BLA.R,GUNKUL.R,VGI.R,ERW.R,TASCO.R,MEGA.R,MBK.R,TIPH.R,M.R,STEC.R,BCPG.R,KKP.R,TCAP.R,VIBHA.R,PTG.R,TTW.R,DOHOME.R,SCCC.R,PSL.R,TVO.R,BLAND.R,BPP.R,STARK.R,ORI.R,JMART.R,AAV.R,BA.R,SUPER.R,MAJOR.R,BYD.R,STGT.R,RCL.R,TTA.R,TPIPL.R,DCC.R,TPIPP.R,PSH.R,AURA.R,ICHI.R,CKP.R,SNNP.R,RS.R,ESSO.R,THCOM.R,THANI.R,BAFS.R,KSL.R,TQM.R,FORTH.R,SJWD.R,SC.R,EPG.R,JAS.R,PRM.R,BEC.R,SPCG.R,TFG.R,ASK.R,KEX.R,NEX.R,RBF.R,ONEE.R,SGP.R,GFPT.R,SABUY.R,DITTO.R,WHAUP.R,ACE.R,SINGER.R,S.R,PTL.R,DELTA,VHM VN,VIC VN,HPG VN,NVL VN,MSN VN,VNM VN,STB VN,1476.TW,9910.TW,VCB VN,VJC VN,VRE VN,SSI VN'
    );
    expect(Array.isArray(profiles)).toBeTruthy();
    expect(profiles.length).toBeGreaterThan(0);
  }, 30000);
  it('profile - Not Found', async () => {
    let errorMsg = '';
    try {
      const fmp: FMPService = new FMPService(
        undefined,
        ConfigurationUtil.fmpApiKey()
      );
      console.log(await fmp.profile('$USD,aPPPL'));
    } catch (error) {
      if (error instanceof Error) {
        errorMsg = error.message;
      }
    }
    expect(errorMsg).toBe('');
  }, 10000);
  it('historicalPriceFull - Happy Path', async () => {
    const fmp: FMPService = new FMPService(
      undefined,
      ConfigurationUtil.fmpApiKey()
    );
    const historical = await fmp.historicalPriceFull('VOO,VIG');
    expect(Array.isArray(historical)).toBeTruthy();
    expect(historical.length).toBe(2);
    expect(historical[0].symbol).toBe('VIG');
    expect(historical[1].symbol).toBe('VOO');
  });
  it('availableTraded - Happy Path', async () => {
    const fmp: FMPService = new FMPService(
      undefined,
      ConfigurationUtil.fmpApiKey()
    );
    const availableTraded = await fmp.availableTraded();
    expect(Array.isArray(availableTraded)).toBeTruthy();
    expect(availableTraded.length).toBeGreaterThan(0);
  }, 10000);
  it('sp500 - Happy Path', async () => {
    const fmp: FMPService = new FMPService(
      undefined,
      ConfigurationUtil.fmpApiKey()
    );
    const sp500 = await fmp.sp500();
    expect(Array.isArray(sp500)).toBeTruthy();
    expect(sp500.length).toBeGreaterThan(0);
  }, 10000);
  it('nasdaq - Happy Path', async () => {
    const fmp: FMPService = new FMPService(
      undefined,
      ConfigurationUtil.fmpApiKey()
    );
    const nasdaq = await fmp.nasdaq();
    expect(Array.isArray(nasdaq)).toBeTruthy();
    expect(nasdaq.length).toBeGreaterThan(0);
  }, 10000);
  it('dowJones - Happy Path', async () => {
    const fmp: FMPService = new FMPService(
      undefined,
      ConfigurationUtil.fmpApiKey()
    );
    const dowJones = await fmp.dowJones();
    expect(Array.isArray(dowJones)).toBeTruthy();
    expect(dowJones.length).toBeGreaterThan(0);
  }, 10000);
  it('apiRest - Error', async () => {
    const apiRest: ApiRestError429 = new ApiRestError429();
    apiRest.json;
    const fmp: FMPService = new FMPService(apiRest);
    let errorMsg = '';
    try {
      await fmp.ApiRest('');
    } catch (error) {
      if (error instanceof Error) {
        errorMsg = error.message;
      }
    }
    expect(errorMsg).toBe('Maximum call stack size exceeded');
  });
  it('apiRest - validApiKey', async () => {
    let errorMsg1 = '';
    try {
      FMPService.validApiKey(undefined);
    } catch (error) {
      if (error instanceof Error) {
        errorMsg1 = error.message;
      }
    }
    let errorMsg2 = '';
    try {
      FMPService.validApiKey('');
    } catch (error) {
      if (error instanceof Error) {
        errorMsg2 = error.message;
      }
    }
    expect(errorMsg1).toBe('FMP API KEY is not valid');
    expect(errorMsg2).toBe('FMP API KEY is not valid');
    expect(FMPService.validApiKey('aqw')).toBeTruthy();
  });
});
