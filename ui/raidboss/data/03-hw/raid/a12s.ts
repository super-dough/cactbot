import Conditions from '../../../../../resources/conditions';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export interface Data extends RaidbossData {
  scourge: string[];
}

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.AlexanderTheSoulOfTheCreatorSavage,
  timelineFile: 'a12s.txt',
  initData: () => {
    return {
      scourge: [],
    };
  },
  timelineTriggers: [
    {
      id: 'A12S Divine Spear',
      regex: /Divine Spear/,
      beforeSeconds: 5,
      response: Responses.tankCleave(),
    },
    {
      id: 'A12S Holy Bleed',
      regex: /Holy Bleed/,
      beforeSeconds: 5,
      response: Responses.bigAoe(),
    },
  ],
  triggers: [
    {
      id: 'A12S Punishing Heat',
      type: 'StartsUsing',
      netRegex: { source: 'Alexander Prime', id: '19E9' },
      response: Responses.tankBuster(),
    },
    {
      // Applies to both holy and blazing scourge.
      id: 'A12S Holy Blazing Scourge You',
      type: 'HeadMarker',
      netRegex: { id: '001E' },
      condition: (data, matches) => {
        // Ignore Holy Scourge later in the fight.
        if (data.scourge.length > 2)
          return false;
        return data.me === matches.target;
      },
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Scourge on YOU',
          de: 'Licht auf DIR',
          fr: 'Lumière sur VOUS',
          ja: '自分に白光の鞭',
          cn: '白光之鞭点名',
          ko: '성광의 채찍 대상자',
        },
      },
    },
    {
      id: 'A12S Blazing Scourge Collect',
      type: 'HeadMarker',
      netRegex: { id: '001E' },
      run: (data, matches) => data.scourge.push(matches.target),
    },
    {
      id: 'A12S Blazing Scourge Report',
      type: 'HeadMarker',
      netRegex: { id: '001E', capture: false },
      condition: (data) => {
        // Ignore Holy Scourge later in the fight.
        if (data.scourge.length > 2)
          return false;

        return data.role === 'healer' || data.job === 'BLU';
      },
      delaySeconds: 0.5,
      suppressSeconds: 1,
      infoText: (data, _matches, output) => {
        // Ignore Holy Scourge later in the fight.
        if (data.scourge.length > 2)
          return false;

        const names = data.scourge.map((x) => data.ShortName(x)).sort();
        if (names.length === 0)
          return;
        return output.text!({ players: names.join(', ') });
      },
      outputStrings: {
        text: {
          en: 'Scourge: ${players}',
          de: 'Licht: ${players}',
          fr: 'Lumière : ${players}',
          ja: '${players}に白光の鞭',
          cn: '白光之鞭点:${players}',
          ko: '성광의 채찍:${players}',
        },
      },
    },
    {
      id: 'A12S Mega Holy',
      type: 'StartsUsing',
      netRegex: { source: 'Alexander Prime', id: '19EE', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'A12S Incinerating Heat',
      type: 'HeadMarker',
      netRegex: { id: '003E' },
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'A12S Laser Sacrament',
      type: 'StartsUsing',
      netRegex: { source: 'Alexander Prime', id: '19EB', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Lasers',
          de: 'Laser',
          fr: 'Lasers',
          ja: '十字の秘蹟',
          cn: '十字圣礼',
          ko: '십자 성례',
        },
      },
    },
    {
      id: 'A12S Radiant Sacrament',
      type: 'StartsUsing',
      netRegex: { source: 'Alexander Prime', id: '19ED', capture: false },
      response: Responses.getUnder('alert'),
    },
    {
      id: 'A12S House Arrest',
      type: 'Tether',
      netRegex: { id: '001C' },
      condition: (data, matches) => matches.source === data.me || matches.target === data.me,
      infoText: (data, matches, output) => {
        const partner = matches.source === data.me ? matches.target : matches.source;
        return output.text!({ player: data.ShortName(partner) });
      },
      outputStrings: {
        text: {
          en: 'Close Tethers (${player})',
          de: 'Nahe Verbindungen (${player})',
          fr: 'Liens proches (${player})',
          ja: '(${player})に近づく',
          cn: '靠近连线 (${player})',
          ko: '강제접근: 상대와 가까이 붙기 (${player})',
        },
      },
    },
    {
      id: 'A12S Restraining Order',
      type: 'Tether',
      netRegex: { id: '001D' },
      condition: (data, matches) => matches.source === data.me || matches.target === data.me,
      alertText: (data, matches, output) => {
        const partner = matches.source === data.me ? matches.target : matches.source;
        return output.text!({ player: data.ShortName(partner) });
      },
      outputStrings: {
        text: {
          en: 'Far Tethers (${player})',
          de: 'Entfernte Verbindungen (${player})',
          fr: 'Liens éloignés (${player})',
          ja: ' (${player})から離れる',
          cn: '远离连线 (${player})',
          ko: '접근금지: 상대와 떨어지기 (${player})',
        },
      },
    },
    {
      id: 'A12S Shared Sentence',
      type: 'GainsEffect',
      netRegex: { effectId: '462' },
      condition: Conditions.targetIsYou(),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Shared Sentence',
          de: 'Urteil Kollektivstrafe',
          fr: 'Partagez peine collective',
          ja: '集団罰',
          cn: '集团罪',
          ko: '집단형: 쉐어',
        },
      },
    },
    {
      id: 'A12S Defamation',
      type: 'GainsEffect',
      netRegex: { effectId: '460' },
      condition: Conditions.targetIsYou(),
      alarmText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Defamation',
          de: 'Ehrenstrafe',
          fr: 'Diffamation',
          ja: '名誉罰',
          cn: '名誉罪',
          ko: '명예형: 멀리가기',
        },
      },
    },
    {
      id: 'A12S Judgment Crystal',
      type: 'HeadMarker',
      netRegex: { id: '0017' },
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Crystal on YOU',
          de: 'Kristall auf DIR',
          fr: 'Cristal sur VOUS',
          ja: '自分に結晶',
          cn: '结晶点名',
          ko: '나에게 수정',
        },
      },
    },
    {
      id: 'A12S Holy Scourge',
      type: 'StartsUsing',
      netRegex: { source: 'Alexander Prime', id: '1A0B', capture: false },
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Shared Tankbuster',
          de: 'geteilter Tankbuster',
          fr: 'Partagez le Tank buster',
          ja: '頭割りタンクバスター',
          cn: '分摊死刑',
          ko: '쉐어 탱크버스터',
        },
      },
    },
    {
      id: 'A12S Chastening Heat',
      type: 'StartsUsing',
      netRegex: { source: 'Alexander Prime', id: '1A0D' },
      response: Responses.tankBusterSwap(),
    },
    {
      id: 'A12S Communion Tether',
      type: 'Tether',
      netRegex: { source: 'Alexander', id: '0036' },
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Puddle Tether on YOU',
          de: 'Flächen-Verbindung auf dir',
          fr: 'Lien Zone au sol sur VOUS',
          ja: '自分に線',
          cn: '放圈连线点名',
          ko: '장판 남기는 선 대상자',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        '(?<! )Alexander(?! )': 'Alexander',
        'Alexander Prime': 'Prim-Alexander',
        'Judgment Crystal': 'Urteilskristall',
        'The General\'s Might': 'Arrhidaios (?:der|die|das) Stark(?:e|er|es|en)',
        'The General\'s Time': 'Arrhidaios (?:der|die|das) Kolossal(?:e|er|es|en)',
        'The General\'s Wing': 'Arrhidaios (?:der|die|das) Überwältigend(?:e|er|es|en)',
      },
      'replaceText': {
        '(?<! )Sacrament': 'Sakrament',
        '\\(Radiant\\?\\) Sacrament': '(Brennendes?) Sakrament',
        'Almost Holy': 'Semi-Sanctus',
        'Arrhidaeus\'s Lanner': 'Arrhidaios der Bote',
        'Blazing Scourge': 'Peitschendes Licht',
        'Chastening Heat': 'Brennende Verdammung',
        'Chronofoil': 'Zeitschwingen',
        'Communion': 'Kommunion',
        'Confession': 'Bekenntnis',
        'Divine Judgment': 'Göttliches Urteil',
        'Divine Spear': 'Heiliger Speer',
        'Gravitational Anomaly': 'Gravitationsanomalie',
        'Half Gravity': 'Semi-Gravitas',
        'Holy Bleed': 'Sanctus-Einschlag',
        'Holy Scourge': 'Peitschende Gloriole',
        'Inception': 'Raumzeit-Eingriff',
        'Incinerating Heat': 'Sengende Hitze',
        'Judgment Crystal': 'Urteilskristall',
        'Mega Holy': 'Super-Sanctus',
        'Punishing Heat': 'Brennendes Urteil',
        'Radiant Sacrament': 'Brennendes Sakrament',
        'Smash': 'Schmettern',
        'Summon Alexander': 'Alexanders Beschwörung',
        'Temporal Stasis': 'Zeitstillstand',
        'Tetrashatter': 'Kristallbruch',
        'The General\'s Might': 'Arrhidaios der Starke',
        'The General\'s Time': 'Arrhidaios der Kolossale',
        'The General\'s Wing': 'Arrhidaios der Überwältigende',
        'Void Of Repentance': 'Kammer der Buße',
        'timegate(?!s)': 'Zeittor',
        'timegates active': 'Zeittore Aktiv',
        'timestop': 'Zeitstopp',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        '(?<! )Alexander(?! )': 'Alexander',
        'Alexander Prime': 'Primo-Alexander',
        'Judgment Crystal': 'Cristal du jugement',
        'The General\'s Might': 'Pouvoir d\'Arrhabée',
        'The General\'s Time': 'Temps d\'Arrhabée',
        'The General\'s Wing': 'Aile d\'Arrhabée',
      },
      'replaceText': {
        '\\(W\\)': '(O)',
        '(?<! )Sacrament': 'Sacrement',
        '--timestop--': '--arrêt du temps--',
        '\\(Radiant\\?\\) Sacrament': 'Sacrement (rayonnant ?)',
        'Almost Holy(?!\\?)': 'Quasi-Miracle',
        'Almost Holy\\?': 'Quasi-Miracle ?',
        'Arrhidaeus\'s Lanner': 'Messager d\'Arrhabée',
        'Blazing Scourge': 'Lumière fustigeante',
        'Chastening Heat': 'Chaleur de l\'ordalie',
        'Chronofoil': 'Ailes du temps',
        'Communion': 'Communion',
        'Confession': 'Confession',
        'Divine Judgment': 'Jugement divin',
        'Divine Spear': 'Épieu divin',
        'Gravitational Anomaly': 'Anomalie gravitationnelle',
        'Half Gravity': 'Demi-Pesanteur',
        'Holy Bleed': 'Impact miraculeux',
        'Holy Scourge': 'Lumière fustigeante',
        'Inception': 'Commencement',
        'Incinerating Heat': 'Chaleur purifiante',
        'Judgment Crystal': 'Cristal du jugement',
        'Mega Holy': 'Méga Miracle',
        'Punishing Heat': 'Chaleur punitive',
        'Radiant Sacrament': 'Sacrement rayonnant',
        'Smash': 'Fracassement',
        'Summon Alexander': 'Invocation d\'Alexander',
        'Temporal Stasis': 'Stase temporelle',
        'Tetrashatter': 'Rupture',
        'The General\'s Might': 'Pouvoir d\'Arrhabée',
        'The General\'s Time': 'Temps d\'Arrhabée',
        'The General\'s Wing': 'Aile d\'Arrhabée',
        'timegate': 'Porte temporelle',
        'Void Of Repentance': 'Vide du repentir',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        '(?<! )Alexander(?! )': 'アレキサンダー',
        'Alexander Prime': 'アレキサンダー・プライム',
        'Judgment Crystal': '審判の結晶',
        'The General\'s Might': 'アリダイオス・マイト',
        'The General\'s Time': 'アリダイオス・タイム',
        'The General\'s Wing': 'アリダイオス・ウィング',
      },
      'replaceText': {
        '--timestop--': '--時間停止--',
        '(?<! )Sacrament': '十字の秘蹟',
        'Almost Holy': 'プチホーリー',
        'Arrhidaeus\'s Lanner': 'アリダイオス・ランナー',
        'Blazing Scourge': '白光の鞭',
        'Chastening Heat': '神罰の熱線',
        'Chronofoil': '時の翼',
        'Communion': 'コミュニオン',
        'Confession': '強制告解',
        'Divine Judgment': '聖なる審判',
        'Divine Spear': '聖なる炎',
        'Gravitational Anomaly': '重力異常',
        'Half Gravity': 'プチグラビデ',
        'Holy Bleed': 'ホーリーバースト',
        'Holy Scourge': '聖光の鞭',
        'Inception': '時空潜行',
        'Incinerating Heat': '浄化の熱線',
        'Judgment Crystal': '審判の結晶',
        'Mega Holy': 'メガホーリー',
        'Punishing Heat': '懲罰の熱線',
        'Radiant Sacrament': '拝火の秘蹟',
        '\\(Radiant\\?\\) Sacrament': '十字/拝火の秘蹟',
        'Smash': 'スマッシュ',
        'Summon Alexander': 'アレキサンダー召喚',
        'Temporal Stasis': '時間停止',
        'Tetrashatter': '結晶破裂',
        'The General\'s Might': 'アリダイオス・マイト',
        'The General\'s Time': 'アリダイオス・タイム',
        'The General\'s Wing': 'アリダイオス・ウィング',
        'timegate(?!s)': 'タイムゲート',
        'timegates active': 'タイムゲート起動',
        'Void Of Repentance': '懺悔の間',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        '(?<! )Alexander(?! )': '亚历山大',
        'Alexander Prime': '至尊亚历山大',
        'Judgment Crystal': '审判结晶',
        'The General\'s Might': '阿里达乌斯之力',
        'The General\'s Time': '阿里达乌斯之时',
        'The General\'s Wing': '阿里达乌斯之翼',
      },
      'replaceText': {
        '(?<!Radiant )Sacrament': '十字圣礼',
        'Almost Holy': '小神圣',
        'Arrhidaeus\'s Lanner': '阿里达乌斯之速',
        'Blazing Scourge': '白光之鞭',
        'Chastening Heat': '神罚射线',
        'Chronofoil': '光阴之翼',
        'Communion': '圣餐',
        'Confession': '强制告解',
        'Divine Judgment': '神圣审判',
        'Divine Spear': '圣炎',
        'Gravitational Anomaly': '重力异常',
        'Half Gravity': '小重力',
        'Holy Bleed': '神圣爆发',
        'Holy Scourge': '圣光之鞭',
        'Inception': '时空潜行',
        'Incinerating Heat': '净化射线',
        'Judgment Crystal': '审判结晶',
        'Mega Holy': '百万神圣',
        'Punishing Heat': '惩戒射线',
        'Radiant Sacrament': '拜火圣礼',
        'Smash': '碎击斩',
        'Summon Alexander': '召唤亚历山大',
        'Temporal Stasis': '时间停止',
        'Tetrashatter': '结晶破碎',
        'The General\'s Might': '阿里达乌斯之力',
        'The General\'s Time': '阿里达乌斯之时',
        'The General\'s Wing': '阿里达乌斯之翼',
        'Void Of Repentance': '忏悔区',
        'timegate(?!s)': '时空门',
        'timegates active': '时空门激活',
        'timestop': '时停',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        '(?<! )Alexander(?! )': '알렉산더',
        'Alexander Prime': '알렉산더 프라임',
        'Judgment Crystal': '심판의 결정체',
        'The General\'s Might': '아리다이오스의 권력',
        'The General\'s Time': '아리다이오스의 시간',
        'The General\'s Wing': '아리다이오스의 날개',
      },
      'replaceText': {
        '\\(Radiant\\?\\) Sacrament': '원형/십자 성례',
        '(?<! )Sacrament': '십자 성례',
        'Almost Holy': '프티 홀리',
        'Arrhidaeus\'s Lanner': '아리다이오스의 전령',
        'Blazing Scourge': '백광의 채찍',
        'Chastening Heat': '신벌의 열선',
        'Chronofoil': '시간의 날개',
        'Communion': '성체 배령',
        'Confession': '강제 고해',
        'Divine Judgment': '신성한 심판',
        'Divine Spear': '신성한 불꽃',
        'Gravitational Anomaly': '중력 이상',
        'Half Gravity': '프티 그라비데',
        'Holy Bleed': '성스러운 폭발',
        'Holy Scourge': '성광의 채찍',
        'Inception': '시공 잠행',
        'Incinerating Heat': '정화의 열선',
        'Judgment Crystal': '심판의 결정체',
        'Mega Holy': '메가 홀리',
        'Punishing Heat': '징벌의 열선',
        'Radiant Sacrament': '원형 성례',
        'Smash': '박살',
        'Summon Alexander': '알렉산더 소환',
        'Temporal Stasis': '시간 정지',
        'Tetrashatter': '결정체 파열',
        'The General\'s Might': '아리다이오스의 권력',
        'The General\'s Time': '아리다이오스의 시간',
        'The General\'s Wing': '아리다이오스의 날개',
        'Void Of Repentance': '참회의 방',
        'timegate(?!s)': '시간 차원문',
        'timegates active': '시간 차원문 활성화',
        'timestop': '시간 정지',
      },
    },
  ],
};

export default triggerSet;
