export interface Mountain {
  id: string;
  name: string;
  region: string;
  regionCode: 'nan' | 'xi' | 'bei' | 'dong' | 'zhong';
  description: string;
  creatures: Creature[];
  rivers: string[];
  minerals: string[];
  position: [number, number, number];
  height: number;
}

export interface Creature {
  name: string;
  type: 'beast' | 'bird' | 'fish' | 'snake' | 'plant' | 'god';
  description: string;
  effect: string;
}

export interface Region {
  code: 'nan' | 'xi' | 'bei' | 'dong' | 'zhong';
  name: string;
  fullName: string;
  color: string;
  mountainCount: number;
  totalDistance: string;
  description: string;
}

export const regions: Region[] = [
  {
    code: 'nan',
    name: '南山经',
    fullName: '南山经',
    color: '#2d8a4e',
    mountainCount: 40,
    totalDistance: '一万六千三百八十里',
    description: '南方之山，自招摇之山至箕尾之山，多桂金玉，有祝余、迷谷、狌狌等异物。',
  },
  {
    code: 'xi',
    name: '西山经',
    fullName: '西山经',
    color: '#c9a227',
    mountainCount: 77,
    totalDistance: '一万七千五百一十七里',
    description: '西方之山，自钱来之山至騩山，有昆仑之丘、西王母所居，多金玉奇兽。',
  },
  {
    code: 'bei',
    name: '北山经',
    fullName: '北山经',
    color: '#3b6ea5',
    mountainCount: 87,
    totalDistance: '二万三千二百三十里',
    description: '北方之山，自单狐之山至隄山，多马多玉，有精卫填海之发鸠山。',
  },
  {
    code: 'dong',
    name: '东山经',
    fullName: '东山经',
    color: '#2d8a8a',
    mountainCount: 46,
    totalDistance: '一万八千九百六十里',
    description: '东方之山，自敕之山至太山，临于东海，多鱼多怪。',
  },
  {
    code: 'zhong',
    name: '中山经',
    fullName: '中山经',
    color: '#a23838',
    mountainCount: 197,
    totalDistance: '二万一千三百七十一里',
    description: '中部之山，自甘枣之山至荣余之山，天下名山之最众者。',
  },
];

export const mountains: Mountain[] = [
  {
    id: 'm001',
    name: '招摇之山',
    region: '南山经',
    regionCode: 'nan',
    description: '南山经之首，临于西海之上，多桂，多金玉。有草名祝余，食之不饥；有木名迷谷，佩之不迷；有兽名狌狌，食之善走。',
    creatures: [
      { name: '狌狌', type: 'beast', description: '其状如禺而白耳，伏行人走', effect: '食之善走' },
      { name: '祝余', type: 'plant', description: '其状如韭而青华', effect: '食之不饥' },
      { name: '迷谷', type: 'plant', description: '其状如谷而黑理，其华四照', effect: '佩之不迷' },
    ],
    rivers: ['丽麂之水'],
    minerals: ['金玉'],
    position: [8, 2, -12],
    height: 3.5,
  },
  {
    id: 'm002',
    name: '青丘之山',
    region: '南山经',
    regionCode: 'nan',
    description: '其阳多玉，其阴多青雘。有兽焉，其状如狐而九尾，其音如婴儿，能食人，食者不蛊。',
    creatures: [
      { name: '九尾狐', type: 'beast', description: '其状如狐而九尾，其音如婴儿，能食人', effect: '食者不蛊' },
      { name: '灌灌', type: 'bird', description: '其状如鸠，其音若呵', effect: '佩之不惑' },
      { name: '赤鱬', type: 'fish', description: '其状如鱼而人面，其音如鸳鸯', effect: '食之不疥' },
    ],
    rivers: ['英水'],
    minerals: ['玉', '青雘'],
    position: [14, 2, -8],
    height: 4,
  },
  {
    id: 'm003',
    name: '丹穴之山',
    region: '南山经',
    regionCode: 'nan',
    description: '其上多金玉。丹水出焉，而南流注于渤海。有鸟焉，其状如鸡，五采而文，名曰凤凰。',
    creatures: [
      { name: '凤凰', type: 'bird', description: '其状如鸡，五采而文，首文曰德，翼文曰义，背文曰礼，膺文曰仁，腹文曰信', effect: '见则天下安宁' },
    ],
    rivers: ['丹水'],
    minerals: ['金玉'],
    position: [10, 2, -4],
    height: 3.8,
  },
  {
    id: 'm004',
    name: '昆仑之丘',
    region: '西山经',
    regionCode: 'xi',
    description: '是实惟帝之下都，神陆吾司之。其神状虎身而九尾，人面而虎爪。有兽名土蝼，是食人。有木名沙棠，可以御水。',
    creatures: [
      { name: '陆吾', type: 'god', description: '虎身而九尾，人面而虎爪，司天之九部及帝之囿时', effect: '司天之九部' },
      { name: '土蝼', type: 'beast', description: '其状如羊而四角', effect: '是食人' },
      { name: '钦原', type: 'bird', description: '其状如蜂，大如鸳鸯', effect: '蠚鸟兽则死，蠚木则枯' },
      { name: '沙棠', type: 'plant', description: '其状如棠，黄华赤实，其味如李而无核', effect: '可以御水，食之使人不溺' },
    ],
    rivers: ['河水', '赤水', '洋水', '墨水'],
    minerals: ['玉'],
    position: [-8, 3, -6],
    height: 6,
  },
  {
    id: 'm005',
    name: '玉山',
    region: '西山经',
    regionCode: 'xi',
    description: '是西王母所居也。西王母其状如人，豹尾虎齿而善啸，蓬发戴胜，是司天之厉及五残。',
    creatures: [
      { name: '西王母', type: 'god', description: '其状如人，豹尾虎齿而善啸，蓬发戴胜', effect: '司天之厉及五残' },
      { name: '狡', type: 'beast', description: '其状如犬而豹文，其角如牛', effect: '见则其国大穰' },
      { name: '胜遇', type: 'bird', description: '其状如翟而赤', effect: '见则其国大水' },
    ],
    rivers: [],
    minerals: ['玉'],
    position: [-12, 3, -2],
    height: 5,
  },
  {
    id: 'm006',
    name: '钟山',
    region: '西山经',
    regionCode: 'xi',
    description: '其子曰鼓，其状如人面而龙身。有神名烛阴，视为昼，瞑为夜，吹为冬，呼为夏，身长千里。',
    creatures: [
      { name: '烛龙', type: 'god', description: '人面蛇身而赤，视为昼，瞑为夜，吹为冬，呼为夏，身长千里', effect: '是烛九阴' },
      { name: '鼓', type: 'god', description: '人面而龙身', effect: '与钦丕杀葆江于昆仑之阳' },
    ],
    rivers: [],
    minerals: ['玉'],
    position: [-14, 3, -10],
    height: 5.5,
  },
  {
    id: 'm007',
    name: '太华之山',
    region: '西山经',
    regionCode: 'xi',
    description: '削成而四方，其高五千仞，其广十里，鸟兽莫居。有蛇名肥囗，六足四翼，见则天下大旱。',
    creatures: [
      { name: '肥蛇', type: 'snake', description: '六足四翼', effect: '见则天下大旱' },
    ],
    rivers: [],
    minerals: [],
    position: [-6, 3, 2],
    height: 7,
  },
  {
    id: 'm008',
    name: '发鸠之山',
    region: '北山经',
    regionCode: 'bei',
    description: '其上多柘木。有鸟焉，其状如乌，文首、白喙、赤足，名曰精卫。是炎帝之少女名曰女娃，溺而不返，故为精卫。',
    creatures: [
      { name: '精卫', type: 'bird', description: '其状如乌，文首、白喙、赤足，炎帝之少女女娃所化', effect: '常衔西山之木石，以堙于东海' },
    ],
    rivers: ['漳水'],
    minerals: [],
    position: [-2, 3, 10],
    height: 3.5,
  },
  {
    id: 'm009',
    name: '太行之山',
    region: '北山经',
    regionCode: 'bei',
    description: '北山经之首，其首曰归山，其上有金玉，其下有碧。有兽名𫛭，善还；有鸟名𫛩，是善惊。',
    creatures: [
      { name: '𫛭', type: 'beast', description: '其状如羊而四角，马尾而有距', effect: '善还' },
    ],
    rivers: ['沁水', '丹水'],
    minerals: ['金玉', '碧'],
    position: [-4, 3, 6],
    height: 5,
  },
  {
    id: 'm010',
    name: '雁门之山',
    region: '北山经',
    regionCode: 'bei',
    description: '雁出其间。无草木。北临北海，多马多玉。',
    creatures: [],
    rivers: [],
    minerals: ['玉'],
    position: [-6, 3, 14],
    height: 4,
  },
  {
    id: 'm011',
    name: '泰山',
    region: '东山经',
    regionCode: 'dong',
    description: '其上多玉，其下多金。有兽焉，其状如豚而有珠，名曰狪狪。环水出焉，东流注于江。',
    creatures: [
      { name: '狪狪', type: 'beast', description: '其状如豚而有珠', effect: '其鸣自詨' },
    ],
    rivers: ['环水'],
    minerals: ['玉', '金'],
    position: [8, 2, 8],
    height: 4.5,
  },
  {
    id: 'm012',
    name: '青丘之国',
    region: '海外东经',
    regionCode: 'dong',
    description: '其狐四足九尾。在朝阳之谷北。有神曰天吴，是为水伯，八首人面，八足八尾。',
    creatures: [
      { name: '九尾狐', type: 'beast', description: '其狐四足九尾', effect: '食者不蛊' },
      { name: '天吴', type: 'god', description: '八首人面，八足八尾，皆青黄', effect: '是为水伯' },
    ],
    rivers: [],
    minerals: [],
    position: [16, 2, 4],
    height: 3,
  },
  {
    id: 'm013',
    name: '洞庭之山',
    region: '中山经',
    regionCode: 'zhong',
    description: '帝之二女居之，是常游于江渊。澧沅之风，交潇湘之渊，出入必以飘风暴雨。',
    creatures: [
      { name: '帝之二女', type: 'god', description: '帝尧之二女，娥皇女英', effect: '出入必以飘风暴雨' },
    ],
    rivers: ['澧水', '沅水', '潇水', '湘水'],
    minerals: ['黄金', '银', '铁'],
    position: [4, 2, 6],
    height: 3.5,
  },
  {
    id: 'm014',
    name: '青要之山',
    region: '中山经',
    regionCode: 'zhong',
    description: '实惟帝之密都。武罗司之，其状人面而豹文，小要而白齿。有草名荀草，服之美人色。',
    creatures: [
      { name: '武罗', type: 'god', description: '人面而豹文，小要而白齿，穿耳以鐻', effect: '司青要之山' },
      { name: '荀草', type: 'plant', description: '其状如葌，方茎黄华赤实', effect: '服之美人色' },
    ],
    rivers: ['畛水'],
    minerals: ['玉'],
    position: [2, 2, 4],
    height: 3.8,
  },
  {
    id: 'm015',
    name: '不周山',
    region: '西山经',
    regionCode: 'xi',
    description: '北望诸毗之山，临彼岳崇之山，东望泑泽。有嘉果，其实如桃，食之不劳。共工怒触不周山，天柱折，地维绝。',
    creatures: [],
    rivers: [],
    minerals: [],
    position: [-10, 3, -14],
    height: 5,
  },
  {
    id: 'm016',
    name: '槐江之山',
    region: '西山经',
    regionCode: 'xi',
    description: '实惟帝之平圃，神英招司之，其状马身而人面，虎文而鸟翼。南望昆仑，其光熊熊，其气魂魂。',
    creatures: [
      { name: '英招', type: 'god', description: '马身而人面，虎文而鸟翼，徇于四海', effect: '司帝之平圃' },
    ],
    rivers: ['丘时之水'],
    minerals: ['琅玕', '黄金', '玉'],
    position: [-6, 3, -8],
    height: 4.5,
  },
  {
    id: 'm017',
    name: '扶桑',
    region: '海外东经',
    regionCode: 'dong',
    description: '汤谷上有扶桑，十日所浴。居水中，有大木，九日居下枝，一日居上枝。羲和者，帝俊之妻，生十日。',
    creatures: [
      { name: '十日', type: 'god', description: '帝俊与羲和之子，十日并出', effect: '一日居上枝，九日居下枝' },
    ],
    rivers: ['汤谷'],
    minerals: [],
    position: [18, 2, -2],
    height: 4,
  },
  {
    id: 'm018',
    name: '昆仑虚',
    region: '海内西经',
    regionCode: 'xi',
    description: '海内昆仑之虚，在西北，帝之下都。方八百里，高万仞。上有木禾，九井以玉为槛，九门有开明兽守之。',
    creatures: [
      { name: '开明兽', type: 'beast', description: '身大类虎而九首，皆人面', effect: '守昆仑之门' },
      { name: '木禾', type: 'plant', description: '长五寻，大五围', effect: '昆仑之上' },
    ],
    rivers: ['赤水', '河水', '洋水', '黑水', '弱水'],
    minerals: ['玉'],
    position: [-8, 3, -4],
    height: 6.5,
  },
  {
    id: 'm019',
    name: '常羊之山',
    region: '大荒西经',
    regionCode: 'xi',
    description: '形天与帝至此争神，帝断其首，葬之常羊之山。乃以乳为目，以脐为口，操干戚以舞。',
    creatures: [
      { name: '刑天', type: 'god', description: '以乳为目，以脐为口，操干戚以舞', effect: '与帝争神' },
    ],
    rivers: [],
    minerals: [],
    position: [-16, 3, 2],
    height: 4,
  },
  {
    id: 'm020',
    name: '成都载天',
    region: '大荒北经',
    regionCode: 'bei',
    description: '有人珥两黄蛇，把两黄蛇，名曰夸父。夸父不量力，欲追日景，逮之于禺谷。将饮河而不足，道渴而死。',
    creatures: [
      { name: '夸父', type: 'god', description: '珥两黄蛇，把两黄蛇，追日而亡', effect: '弃其杖，化为邓林' },
    ],
    rivers: ['河', '渭', '大泽'],
    minerals: [],
    position: [-4, 3, 16],
    height: 4.5,
  },
  {
    id: 'm021',
    name: '灵山',
    region: '大荒西经',
    regionCode: 'xi',
    description: '巫咸、巫即、巫盼、巫彭、巫姑、巫真、巫礼、巫抵、巫谢、巫罗十巫，从此升降，百药爰在。',
    creatures: [
      { name: '十巫', type: 'god', description: '十巫从此升降，百药爰在', effect: '上下于天，百药爰在' },
    ],
    rivers: [],
    minerals: [],
    position: [-14, 3, 6],
    height: 3.5,
  },
  {
    id: 'm022',
    name: '丰沮玉门',
    region: '大荒西经',
    regionCode: 'xi',
    description: '日月所入。有五采鸟三名：一曰皇鸟，一曰鸾鸟，一曰凤鸟。',
    creatures: [
      { name: '皇鸟', type: 'bird', description: '五采鸟之一', effect: '日月所入之处' },
      { name: '鸾鸟', type: 'bird', description: '五采鸟之一', effect: '见则天下安宁' },
      { name: '凤鸟', type: 'bird', description: '五采鸟之一', effect: '见则天下安宁' },
    ],
    rivers: [],
    minerals: [],
    position: [-18, 3, -4],
    height: 4,
  },
  {
    id: 'm023',
    name: '羲和之国',
    region: '大荒南经',
    regionCode: 'nan',
    description: '有女子名曰羲和，方日浴于甘渊。羲和者，帝俊之妻，生十日。',
    creatures: [
      { name: '羲和', type: 'god', description: '帝俊之妻，生十日，方日浴于甘渊', effect: '浴日于甘渊' },
    ],
    rivers: ['甘水', '甘渊'],
    minerals: [],
    position: [12, 2, -14],
    height: 3.5,
  },
  {
    id: 'm024',
    name: '常羲浴月',
    region: '大荒西经',
    regionCode: 'xi',
    description: '有女子方浴月。帝俊妻常羲，生月十有二，此始浴之。',
    creatures: [
      { name: '常羲', type: 'god', description: '帝俊之妻，生月十有二', effect: '浴月于渊' },
    ],
    rivers: [],
    minerals: [],
    position: [-16, 3, -8],
    height: 3.5,
  },
];

export const creatureTypeLabels: Record<Creature['type'], string> = {
  beast: '异兽',
  bird: '神鸟',
  fish: '怪鱼',
  snake: '异蛇',
  plant: '神草',
  god: '神灵',
};

export const creatureTypeColors: Record<Creature['type'], string> = {
  beast: '#d97757',
  bird: '#7ec8e3',
  fish: '#5ba8d4',
  snake: '#6b9b6b',
  plant: '#8fb968',
  god: '#e3b341',
};
