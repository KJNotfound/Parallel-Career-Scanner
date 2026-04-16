/**
 * 边缘殖民叙事素材（气质上参考沙盒生存殖民类作品，非官方设定）。
 * 童年 / 成年 / 据点由同一哈希咬合；对外职务条用「语境前缀 + 真实职种」短格式。
 */

import type { IdentityKeys } from '@/data/identity-options'
import {
  REGION_FALLBACK_PREFIXES,
  driveLabel,
  regionPrefix,
  squadLabel,
  stressLabel,
} from '@/data/identity-options'
import { pickRealJob } from '@/data/real-jobs'
import { modPositive } from '@/lib/seed-hash'

const PREFIX_EN: Record<string, string> = {
  矿区: 'mine',
  轨道: 'orbital',
  冷库: 'cold',
  前哨: 'outpost',
  营地: 'camp',
  港口: 'port',
  荒漠: 'desert',
  驻点: 'site',
  外包: 'contract',
  临时: 'temp',
  站点: 'depot',
}

export type Tier = 0 | 1 | 2 | 3

export type ChildBackstory = {
  id: string
  tier: Tier
  titleZh: string
  blurbZh: string
  titleEn: string
}

export type AdultBackstory = {
  id: string
  tier: Tier
  titleZh: string
  blurbZh: string
  titleEn: string
}

export const CHILD_BACKSTORIES: ChildBackstory[] = [
  {
    id: 'c_crash',
    tier: 1,
    titleZh: '坠毁舱焊渣区拾荒童',
    blurbZh: '你会认导线，营养膏只有锈味和焦味。',
    titleEn: 'drop-pod scrap kid',
  },
  {
    id: 'c_tribal',
    tier: 0,
    titleZh: '部落帐篷结巴学徒',
    blurbZh: '篝火边烤肉缩水，远征回程少一只鞋。',
    titleEn: 'tribal tent stutterer',
  },
  {
    id: 'c_urb',
    tier: 2,
    titleZh: '廉租竖井管道童',
    blurbZh: '霓虹当太阳，排水管回声用来躲警卫。',
    titleEn: 'shaft-rat',
  },
  {
    id: 'c_glitter',
    tier: 3,
    titleZh: '标本室管理员之子',
    blurbZh: '防腐剂味里学会：疼可以外包，账单不行。',
    titleEn: 'specimen-hall kid',
  },
  {
    id: 'c_medieval',
    tier: 0,
    titleZh: '农奴牧羊童',
    blurbZh: '羊群比人话真；征粮夜你看见锁舌被掰弯。',
    titleEn: 'serf shepherd kid',
  },
  {
    id: 'c_pirate',
    tier: 1,
    titleZh: '海盗舱战利品婴儿',
    blurbZh: '摇篮是弹药衬布，名字在账本是折旧。',
    titleEn: 'raider hold baby',
  },
  {
    id: 'c_cult',
    tier: 1,
    titleZh: '打印机旁教派学徒',
    blurbZh: '祷词背得出型号，热熔胶滴手背算顿悟。',
    titleEn: 'printer cult cadet',
  },
  {
    id: 'c_caravan',
    tier: 0,
    titleZh: '废土车队挂票婴儿',
    blurbZh: '里程比年龄好记，绿洲和退路都是故事。',
    titleEn: 'caravan cradle kid',
  },
  {
    id: 'c_prison',
    tier: 1,
    titleZh: '轨道监狱借读生',
    blurbZh: '铁味打底，牙刷柄磨尖的是「申诉期限」。',
    titleEn: 'orbital hall kid',
  },
  {
    id: 'c_farm',
    tier: 0,
    titleZh: '温室夜班童工',
    blurbZh: '叶绿素灯像永昼，断电时牛呼吸像潮汐。',
    titleEn: 'hydro kid',
  },
  {
    id: 'c_trade',
    tier: 2,
    titleZh: '失联货柜取暖童',
    blurbZh: '体温当货币，广播只播「友好折扣」。',
    titleEn: 'lost-crate kid',
  },
  {
    id: 'c_ice',
    tier: 0,
    titleZh: '冰川裂隙冻疮童',
    blurbZh: '雪砖砌墙，哭声埋风；春天解冻的是债。',
    titleEn: 'rift frost kid',
  },
  {
    id: 'c_desert',
    tier: 0,
    titleZh: '驿站蒸馏桶边童',
    blurbZh: '水咸话也咸；沙暴「带走」商队你后来才懂。',
    titleEn: 'still-bracket kid',
  },
  {
    id: 'c_boomalope',
    tier: 0,
    titleZh: '燃料畜栏旁听童',
    blurbZh: '大人唱别碰角，你只记得角像两颗琥珀。',
    titleEn: 'chem-fence kid',
  },
  {
    id: 'c_engineer',
    tier: 2,
    titleZh: '拆解坞计数童',
    blurbZh: '螺栓有螺纹合同也有，多报零头换热汤。',
    titleEn: 'scrap-count kid',
  },
  {
    id: 'c_noble',
    tier: 3,
    titleZh: '没落册封替身童',
    blurbZh: '替少爷挨骂签字，空白页说是命运附录。',
    titleEn: 'noble stand-in kid',
  },
  {
    id: 'c_mech',
    tier: 2,
    titleZh: '遗迹通风管涂鸦童',
    blurbZh: '冷却管烫出条形码，后来当工号灵感。',
    titleEn: 'vent-tag kid',
  },
  {
    id: 'c_swamp',
    tier: 0,
    titleZh: '沼泽高脚屋病歌童',
    blurbZh: '病名被编成歌，船灯近的像救赎远的像拐。',
    titleEn: 'stilt fever kid',
  },
  {
    id: 'c_vac',
    tier: 2,
    titleZh: '真空牧场安抚童',
    blurbZh: '牛只哼鸣没眼睛，栏网只有静电没风。',
    titleEn: 'vac-ranch kid',
  },
  {
    id: 'c_ork',
    tier: 1,
    titleZh: '佣兵泔水分级学徒',
    blurbZh: '泔水三分：能喝能卖能栽赃，薪是半块营养砖。',
    titleEn: 'mess-slop apprentice',
  },
  {
    id: 'c_lab',
    tier: 3,
    titleZh: '伦理窗外影子童',
    blurbZh: '单向玻璃单向命，念错编号你也认领。',
    titleEn: 'ethics-window kid',
  },
  {
    id: 'c_cert',
    tier: 1,
    titleZh: '出生证厂临时工之子',
    blurbZh: '背面广告写「成为殖民者」，墨未干纸先卷。',
    titleEn: 'cert-print spawn',
  },
]

export const ADULT_BACKSTORIES: AdultBackstory[] = [
  {
    id: 'a_cook',
    tier: 0,
    titleZh: '殖民地厨师',
    blurbZh: '营养膏被谣传回忆味，眼泪不算配给。',
    titleEn: 'colony cook',
  },
  {
    id: 'a_warden',
    tier: 1,
    titleZh: '囚犯理发员',
    blurbZh: '推子响坦白升，发型分级被会计叫 KPI。',
    titleEn: 'barber-warden',
  },
  {
    id: 'a_builder',
    tier: 0,
    titleZh: '沙袋工头',
    blurbZh: '沙袋码墙也码韵，敌袭间隙领读当留白。',
    titleEn: 'sandbag lead',
  },
  {
    id: 'a_medic',
    tier: 1,
    titleZh: '草药看守',
    blurbZh: '治愈致幻分不清，只登记谁多拿一片。',
    titleEn: 'herbal ward',
  },
  {
    id: 'a_hunter',
    tier: 0,
    titleZh: '突击盾牌临时工',
    blurbZh: '盾贴前任编号，传承和层压板一起裂。',
    titleEn: 'shield temp',
  },
  {
    id: 'a_plant',
    tier: 0,
    titleZh: '水培夜班巡检',
    blurbZh: '绿潮像呼吸，清晨藻类总多占一格玻璃。',
    titleEn: 'hydro scout',
  },
  {
    id: 'a_research',
    tier: 2,
    titleZh: '研究台夜班',
    blurbZh: '曲线歪了叫异常美学，废稿被裱成《边缘信号》。',
    titleEn: 'lab night shift',
  },
  {
    id: 'a_negotiate',
    tier: 2,
    titleZh: '递水外交官',
    blurbZh: '条约发酵你递杯，和平像凉白开也要记账。',
    titleEn: 'water negotiator',
  },
  {
    id: 'a_anim',
    tier: 0,
    titleZh: '驯兽失败记录员',
    blurbZh: '咬伤当库存，一咬一卷兽医骂会计夸。',
    titleEn: 'tame-fail clerk',
  },
  {
    id: 'a_solar',
    tier: 1,
    titleZh: '太阳能朝向调解',
    blurbZh: '阴影政治复杂，裁决：东向集体内疚向西。',
    titleEn: 'solar mediator',
  },
  {
    id: 'a_drill',
    tier: 1,
    titleZh: '钻孔值班',
    blurbZh: '空响写日报：今日与虚空临时停火。',
    titleEn: 'drill watch',
  },
  {
    id: 'a_craft',
    tier: 1,
    titleZh: '武器手感质检',
    blurbZh: '不顺手的刀会记仇，敌人不信你改行担架解说。',
    titleEn: 'weapon QA',
  },
  {
    id: 'a_grow',
    tier: 0,
    titleZh: '土豆翻土非编',
    blurbZh: '发芽算背叛，去芽仪式村长说迷信土说季。',
    titleEn: 'potato turner',
  },
  {
    id: 'a_fire',
    tier: 0,
    titleZh: '沙桶保管员',
    blurbZh: '火灭沙里有故事，晨会倒沙细如雨粗如指控。',
    titleEn: 'sand keeper',
  },
  {
    id: 'a_trade',
    tier: 2,
    titleZh: '轨道溢价计算',
    blurbZh: '友好系数敌意利息，乘完队长笑会计默。',
    titleEn: 'orbit surcharge',
  },
  {
    id: 'a_ritual',
    tier: 1,
    titleZh: '香炉比例员',
    blurbZh: '神迹要审批，香灰余量写安慰政策用。',
    titleEn: 'ritual mixer',
  },
  {
    id: 'a_mort',
    tier: 0,
    titleZh: '冷库钥匙员',
    blurbZh: '钥匙像编钟，开门前先咳给里面时间整理脸。',
    titleEn: 'cold key',
  },
  {
    id: 'a_comm',
    tier: 2,
    titleZh: '通讯静默广播',
    blurbZh: '静默译成战术倾听，总部喜前线恨你抄送两边。',
    titleEn: 'comm silence',
  },
  {
    id: 'a_art',
    tier: 2,
    titleZh: '雕塑策展劝退',
    blurbZh: '恐惧雕成角，标签三档：展、遮、先拍再毁。',
    titleEn: 'sculpt curator',
  },
  {
    id: 'a_jan',
    tier: 0,
    titleZh: '超额病房保洁',
    blurbZh: '拖把权杖消毒圣水，纸条写痛会过期。',
    titleEn: 'ward janitor',
  },
  {
    id: 'a_intel',
    tier: 2,
    titleZh: '谣言萃取实习',
    blurbZh: '真相谣言同煮撇沫装罐，上司说精炼你说减肥。',
    titleEn: 'rumor intern',
  },
  {
    id: 'a_mechan',
    tier: 3,
    titleZh: '残骸拆解顾问',
    blurbZh: '残骸发热像笑你听错，报告写先和螺丝和解。',
    titleEn: 'wreck advisor',
  },
]

export const COLONY_NAMES: string[] = [
  '迟到的正义号甲板',
  'B-17荒原站台',
  '沼泽前哨「沼气」',
  '冰川借条避难所',
  '坠毁舱拼接镇',
  '情绪分期康复站',
  '腌肉码头仓库',
  '气体牛实验段',
  '沙漠二次蒸馏驿',
  '通风管围挡区',
  '呼吸按揭塔',
  '土豆圣战环带',
  '泔水荣誉连',
]

export const INCIDENT_LINES: string[] = [
  '集体食物中毒后你讨厌罐头拉环。',
  '见商队抬价，你对「友好」过敏。',
  '工牌背面是前任名字。',
  '帽子挡流弹，被宣传成士气装置。',
  '整箱药丢了，结论写「天气」。',
  '囚犯赠石称月亮，被没收成投掷物。',
  '空白报告被裱成《不可知论的胜利》。',
  '猫蹲太阳能板，登记成干扰源。',
  '通讯哼鸣被归档白噪音。',
  '肋骨摔断：地形教育 vs 自甘风险。',
  '处决日递毛巾，毛巾变圣物。',
  '信用负数，备注过于诚实。',
  '醉命名土豆帝国，次日被征粮。',
  '孩子问外面，你答待办，双方哭。',
  '日记首页殖民者末页墨点。',
  '停电只剩心跳，人事发夜班补贴。',
  '希望埋土豆田，春只长土豆。',
  '狼情绪稳定，你和工资条对看。',
  '申请无故事部门，编制在别宇宙。',
]

export type NarrativePack = {
  jobTitleZh: string
  jobTitleEn: string
  childTitleZh: string
  adultTitleZh: string
  colonyName: string
  incidentLine: string
  /** 两条短简录，避免长文疲劳。 */
  storyBeats: [string, string]
}

function filterAdultsForChild(child: ChildBackstory): AdultBackstory[] {
  return ADULT_BACKSTORIES.filter((a) => Math.abs(a.tier - child.tier) <= 1)
}

function identityChips(id: IdentityKeys): string {
  const parts: string[] = []
  if (id.driveKey) parts.push(driveLabel(id.driveKey).split('/')[0]!.trim())
  if (id.stressKey) parts.push(stressLabel(id.stressKey).split('/')[0]!.trim())
  if (id.squadKey) parts.push(squadLabel(id.squadKey).split('/')[0]!.trim())
  return parts.length ? ` · ${parts.join('·')}` : ''
}

export function buildNarrativePack(bytes: Uint8Array, id: IdentityKeys): NarrativePack {
  const child = CHILD_BACKSTORIES[modPositive(bytes, 8, CHILD_BACKSTORIES.length)]!
  const adultPool = filterAdultsForChild(child)
  const adult = adultPool[modPositive(bytes, 12, adultPool.length)]!
  const colonyName = COLONY_NAMES[modPositive(bytes, 16, COLONY_NAMES.length)]!
  const incidentLine = INCIDENT_LINES[modPositive(bytes, 20, INCIDENT_LINES.length)]!

  let prefix = regionPrefix(id.regionKey)
  if (!prefix) {
    prefix = REGION_FALLBACK_PREFIXES[modPositive(bytes, 68, REGION_FALLBACK_PREFIXES.length)]!
  }
  const real = pickRealJob(bytes, id.skillKey)
  const jobTitleZh = `${prefix}${real.zh}`
  const slug = PREFIX_EN[prefix] ?? 'field'
  const jobTitleEn = `${real.en} (${slug})`

  const storyBeats: [string, string] = [
    `童年：${child.blurbZh} 叙职：${adult.titleZh}`,
    `据点「${colonyName}」。${incidentLine}${identityChips(id)}`,
  ]

  return {
    jobTitleZh,
    jobTitleEn,
    childTitleZh: child.titleZh,
    adultTitleZh: adult.titleZh,
    colonyName,
    incidentLine,
    storyBeats,
  }
}
