import Conditions from '../../../../../resources/conditions';
import Outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export interface Data extends RaidbossData {
  vent?: string[];
  refreshed?: boolean;
}

const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.EdensGateInundationSavage,
  timelineFile: 'e3s.txt',
  timelineTriggers: [
    {
      id: 'E3S Plunging Wave',
      regex: /Plunging Wave/,
      beforeSeconds: 2,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Line Stack',
          de: 'In einer Linie sammeln',
          fr: 'Packez-vous en ligne',
          ja: '直線スタック',
          cn: '直线分摊',
          ko: '쉐어징 모이기',
        },
      },
    },
    {
      id: 'E3S Spilling Wave',
      regex: /Spilling Wave/,
      beforeSeconds: 3,
      condition: (data) => data.role === 'tank',
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Tank Cleaves, Move Front',
          de: 'Tank Cleaves, nach vorne bewegen',
          fr: 'Tank cleave, allez devant',
          ja: '拡散くるよ',
          cn: '坦克放陨石，向前集合',
          ko: '탱버, 앞으로 이동',
        },
      },
    },
  ],
  triggers: [
    {
      id: 'E3S Tidal Roar',
      type: 'StartsUsing',
      netRegex: { id: '3FDC', source: 'Leviathan', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'E3S Tidal Rage',
      type: 'StartsUsing',
      netRegex: { id: '3FDE', source: 'Leviathan', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'E3S Tidal Wave Look',
      type: 'StartsUsing',
      netRegex: { id: '3FF1', source: 'Leviathan', capture: false },
      delaySeconds: 3,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Look for Wave',
          de: 'Nach Welle ausschau halten',
          fr: 'Repérez la vague',
          ja: 'タイダルウェーブくるよ',
          cn: '看浪',
          ko: '해일 위치 확인',
        },
      },
    },
    {
      id: 'E3S Tidal Wave Knockback',
      type: 'StartsUsing',
      netRegex: { id: '3FF1', source: 'Leviathan', capture: false },
      // 3 seconds of cast, 10 seconds of delay.
      // This gives a warning within 5 seconds, so you can hit arm's length.
      delaySeconds: 8,
      response: Responses.knockback(),
    },
    {
      id: 'E3S Rip Current',
      type: 'HeadMarker',
      netRegex: { id: '0017' },
      suppressSeconds: 10,
      alarmText: (data, matches, output) => {
        if (matches.target !== data.me && data.role === 'tank')
          return output.tankSwap!();
      },
      alertText: (data, matches, output) => {
        if (data.me === matches.target)
          return output.tankBusterOnYou!();

        if (data.role === 'healer')
          return output.tankBusters!();
      },
      outputStrings: {
        tankBusterOnYou: Outputs.tankBusterOnYou,
        tankBusters: Outputs.tankBusters,
        tankSwap: Outputs.tankSwap,
      },
    },
    {
      id: 'E3S Undersea Quake Outside',
      type: 'StartsUsing',
      netRegex: { id: '3FEF', source: 'Leviathan', capture: false },
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Get Middle',
          de: 'Geh in die Mitte',
          fr: 'Allez au milieu',
          ja: '外壊れるよ',
          cn: '中间',
          ko: '가운데로',
        },
      },
    },
    {
      id: 'E3S Undersea Quake Inside',
      type: 'StartsUsing',
      netRegex: { id: '3FEE', source: 'Leviathan', capture: false },
      response: Responses.goSides('alarm'),
    },
    {
      id: 'E3S Flare',
      type: 'HeadMarker',
      netRegex: { id: '0057' },
      condition: Conditions.targetIsYou(),
      alarmText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Flare on YOU',
          de: 'Flare auf DIR',
          fr: 'Brasier sur VOUS',
          ja: '自分にフレア',
          cn: '核爆点名',
          ko: '플레어 대상자',
        },
      },
    },
    {
      id: 'E3S Drenching Pulse',
      type: 'StartsUsing',
      netRegex: { id: '3FE2', source: 'Leviathan', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Stack, Bait Puddles',
          de: 'Sammeln, Flächen ködern',
          fr: 'Packez-vous, attirez les zones au sol',
          ja: '集合',
          cn: '集合',
          ko: '모이기',
        },
      },
    },
    {
      id: 'E3S Drenching Pulse Puddles',
      type: 'StartsUsing',
      netRegex: { id: '3FE2', source: 'Leviathan', capture: false },
      delaySeconds: 2.9,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Drop Puddles Outside',
          de: 'Flächen drausen ablegen',
          fr: 'Déposez les zones au sol à l\'extérieur',
          ja: '散開',
          cn: '散开',
          ko: '산개',
        },
      },
    },
    {
      id: 'E3S Roiling Pulse',
      type: 'StartsUsing',
      netRegex: { id: '3FE4', source: 'Leviathan', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Stack, Bait Puddles',
          de: 'Sammeln, Flächen ködern',
          fr: 'Packez-vous, évitez les zones au sol',
          ja: '集合',
          cn: '集合',
          ko: '모이기',
        },
      },
    },
    {
      id: 'E3S Roiling Pulse Abilities',
      type: 'StartsUsing',
      netRegex: { id: '3FE4', source: 'Leviathan', capture: false },
      delaySeconds: 2.9,
      infoText: (data, _matches, output) => {
        if (data.role === 'tank')
          return output.flareToOutsideCorner!();

        return output.stackOutsideAvoidFlares!();
      },
      outputStrings: {
        flareToOutsideCorner: {
          en: 'Flare To Outside Corner',
          de: 'Flare in die äuseren Ecken',
          fr: 'Brasier dans un coin extérieur',
          ja: '隅にフレア',
          cn: '外侧角落放核爆',
          ko: '플레어 양옆 뒤로 유도',
        },
        stackOutsideAvoidFlares: {
          en: 'Stack Outside, Avoid Flares',
          de: 'Auserhalb sammeln, Flares vermeiden',
          fr: 'Packez-vous à l\'extérieur, évitez les brasiers',
          ja: '前で集合',
          cn: '外侧集合躲避核爆',
          ko: '양옆 앞으로 모이고, 플레어 피하기',
        },
      },
    },
    {
      id: 'E3S Stormy Horizon',
      type: 'StartsUsing',
      netRegex: { id: '3FFE', source: 'Leviathan', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Panto Puddles x5',
          de: 'Panto Flächen x5',
          fr: 'Panto Zones au sol x5',
          ja: 'パント5回',
          cn: '处理水圈 x5',
          ko: '발밑장판 5회',
        },
      },
    },
    {
      id: 'E3S Hydrothermal Vent Tether',
      type: 'Tether',
      netRegex: { id: '005A', target: 'Leviathan' },
      condition: (data, matches) => data.me === matches.source,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Puddle Tether on YOU',
          de: 'Black Smoker Verbindung auf DIR',
          fr: 'Lien de zones au sol sur VOUS',
          ja: '線ついた',
          cn: '水圈连线',
          ko: '나에게 선연결',
        },
      },
    },
    {
      id: 'E3S Hydrothermal Vent Collect',
      type: 'Tether',
      netRegex: { id: '005A', target: 'Leviathan' },
      run: (data, matches) => {
        data.vent ??= [];
        data.vent.push(matches.source);
      },
    },
    {
      id: 'E3S Hydrothermal Vent',
      type: 'Tether',
      netRegex: { id: '005A', target: 'Leviathan', capture: false },
      condition: (data) =>
        data.vent && data.vent.length === 2 && !data.vent.includes(data.me) && data.role !== 'tank',
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Pop alternating bubbles',
          de: 'Flächen abwechselnd nehmen',
          fr: 'Apparition des bulles en alternance',
          ja: '水出た',
          cn: '交替踩圈',
          ko: '물장판 밟기',
        },
      },
    },
    {
      id: 'E3S Surging Waters',
      type: 'GainsEffect',
      netRegex: { effectId: '73A' },
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Initial knockback on YOU',
          de: 'Initialer Knockback auf DIR',
          fr: 'Poussée initiale sur VOUS',
          ja: '最初のノックバック',
          cn: '初始击退点名',
          ko: '첫 넉백 대상자',
        },
      },
    },
    {
      // TODO probably need to call out knockbacks later
      // TODO maybe tell other people about stacking for knockbacks
      id: 'E3S Sundering Waters',
      type: 'GainsEffect',
      netRegex: { effectId: '73E' },
      condition: Conditions.targetIsYou(),
      alertText: (_data, matches, output) => {
        const seconds = parseFloat(matches.duration);
        if (seconds <= 8)
          return output.knockbackOnYou!();
      },
      infoText: (_data, matches, output) => {
        const seconds = parseFloat(matches.duration);
        if (seconds <= 8)
          return;
        if (seconds <= 21)
          return output.lateFirstKnockback!();

        return output.lateSecondKnockback!();
      },
      outputStrings: {
        lateFirstKnockback: {
          en: 'Late First Knockback',
          de: 'Erster reinigender Knockback',
          fr: 'Poussée tardive 1',
          ja: '遅ノックバック1',
          cn: '迟击退点名 #1',
          ko: '늦은 넉백 대상자 1',
        },
        lateSecondKnockback: {
          en: 'Late Second Knockback',
          de: 'Zweiter reinigender Knockback',
          fr: 'Poussée tardive 2',
          ja: '遅ノックバック2',
          cn: '迟击退点名 #2',
          ko: '늦은 넉백 대상자 2',
        },
        knockbackOnYou: Outputs.knockbackOnYou,
      },
    },
    {
      // 29 seconds
      id: 'E3S Scouring Waters Defamation',
      type: 'GainsEffect',
      netRegex: { effectId: '765' },
      condition: Conditions.targetIsYou(),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Defamation',
          de: 'Defamation',
          fr: 'Médisance',
          ja: '暴風',
          cn: '暴风',
          ko: '폭풍 대상자',
        },
      },
    },
    {
      id: 'E3S Scouring Waters Avoid Knockback',
      type: 'GainsEffect',
      netRegex: { effectId: '765' },
      condition: Conditions.targetIsYou(),
      delaySeconds: 22,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Avoid Knockback, Move to Back',
          de: 'Vermeide Knockback, dann nach hinten bewegen',
          fr: 'Évitez la poussée, allez à l\'arrière',
          ja: '後ろへ',
          cn: '后方放大圈',
          ko: '넉백 피해서 뒤로 이동',
        },
      },
    },
    {
      id: 'E3S Smothering Waters',
      type: 'GainsEffect',
      netRegex: { effectId: '73D' },
      condition: (data, matches) => {
        // first tsunami stack is 25 seconds
        // second tsunami stack is 13 seconds
        // Everybody is in first stack, but tanks not in the second.
        return parseFloat(matches.duration) > 15 || data.role !== 'tank';
      },
      delaySeconds: (_data, matches) => parseFloat(matches.duration) - 3,
      suppressSeconds: 1,
      response: Responses.stackMarker(),
    },
    {
      id: 'E3S Scouring Waters',
      type: 'GainsEffect',
      netRegex: { effectId: '765' },
      condition: Conditions.targetIsNotYou(),
      delaySeconds: 25,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Move In, Avoid Defamation',
          de: 'Rein gehen, vermeide Defamation',
          fr: 'À l\'intérieur, évitez Médisance',
          ja: '前にノックバック',
          cn: '靠近躲避',
          ko: '안으로 이동, 폭풍 피하기',
        },
      },
    },
    {
      id: 'E3S Sweeping Waters Gain',
      type: 'GainsEffect',
      netRegex: { effectId: '73F' },
      condition: Conditions.targetIsYou(),
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Tank Cone',
          de: 'Tank Kegel',
          fr: 'Cône tank',
          ja: '断絶',
          cn: '坦克三角',
          ko: '확산의 징조 대상자',
        },
      },
    },
    {
      id: 'E3S Sweeping Waters',
      type: 'GainsEffect',
      netRegex: { effectId: '73F' },
      condition: (data, matches) => data.me === matches.target || data.role === 'tank',
      delaySeconds: 13,
      suppressSeconds: 1,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Tank Cone',
          de: 'Tank Kegel',
          fr: 'Cône tank',
          ja: '断絶',
          cn: '坦克三角',
          ko: '확산: 탱 멀리 / 대상자 앞으로',
        },
      },
    },
    {
      id: 'E3S Refreshed',
      type: 'StartsUsing',
      netRegex: { id: '400F', source: 'Leviathan', capture: false },
      run: (data) => data.refreshed = true,
    },
    {
      id: 'E3S Front Left Temporary Current',
      type: 'StartsUsing',
      netRegex: { id: '3FEB', source: 'Leviathan', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Front left / Back right',
          de: 'Vorne Links / Hinten Rechts',
          fr: 'Devant à gauche / Derrière à droite',
          ja: '左前 / 右後ろ',
          cn: '前左 / 后右',
          ko: '↖ 앞 왼쪽 / 뒤 오른쪽 ↘',
        },
      },
    },
    {
      id: 'E3S Front Right Temporary Current',
      type: 'StartsUsing',
      netRegex: { id: '3FEA', source: 'Leviathan', capture: false },
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Front right / Back left',
          de: 'Vorne Rechts / Hinten Links',
          fr: 'Devant à droite / Derrière à gauche',
          ja: '右前 / 左後ろ',
          cn: '前右 / 后左',
          ko: '↗ 앞 오른쪽 / 뒤 왼쪽 ↙',
        },
      },
    },
    {
      // Note: there are different abilities for the followup
      // temporary current, but there's only a 1 second cast time.
      // The original has a 6 second cast time and 4 seconds before
      // the next one.
      id: 'E3S Front Left Temporary Current 2',
      type: 'StartsUsing',
      netRegex: { id: '3FEA', source: 'Leviathan', capture: false },
      condition: (data) => data.refreshed,
      delaySeconds: 6.2,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Front left / Back right',
          de: 'Vorne Links / Hinten Rechts',
          fr: 'Devant à gauche / Derrière à droite',
          ja: '左前 / 右後ろ',
          cn: '前左 / 后右',
          ko: '↖ 앞 왼쪽 / 뒤 오른쪽 ↘',
        },
      },
    },
    {
      id: 'E3S Front Right Temporary Current 2',
      type: 'StartsUsing',
      netRegex: { id: '3FEB', source: 'Leviathan', capture: false },
      condition: (data) => data.refreshed,
      delaySeconds: 6.2,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Front right / Back left',
          de: 'Vorne Rechts / Hinten Links',
          fr: 'Devant à droite / Derrière à gauche',
          ja: '右前 / 左後ろ',
          cn: '前右 / 后左',
          ko: '↗ 앞 오른쪽 / 뒤 왼쪽 ↙',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Leviathan': 'Leviathan',
      },
      'replaceText': {
        'Backbreaking Wave': 'Verwüstende Welle',
        'Black Smokers': 'Schwarzer Raucher',
        '(?<!\\w)Breaking Wave': 'Schmetternde Welle',
        'Drenching Pulse': 'Tosende Wogen',
        'Freak Wave': 'Gigantische Welle',
        'Hot Water': 'Heißes Wasser',
        'Hydrothermal Vent': 'Hydrothermale Quelle',
        'Killer Wave': 'Tödliche Welle',
        'Maelstrom': 'Mahlstrom',
        'Monster Wave': 'Monsterwelle',
        'Plunging Wave': 'Donnernde Welle',
        'Refreshing Shower': 'Erwachen der Tiefen',
        'Rip Current': 'Brandungsrückstrom',
        'Roiling Pulse': 'Wüstende Wogen',
        'Scouring Tsunami': 'Böige Sturzflut',
        'Smothering Tsunami': 'Ertränkende Sturzflut',
        'Spilling Wave': 'Schäumende Welle',
        'Spinning Dive': 'Drehsprung',
        'Stormy Horizon': 'Stürmische See',
        'Sundering Tsunami': 'Zerstörende Sturzflut',
        'Surging Tsunami': 'Erdrückende Sturzflut',
        'Sweeping Tsunami': 'Auflösende Sturzflut',
        'Swirling Tsunami': 'Wirbelnde Sturzflut',
        'Temporary Current': 'Unstete Gezeiten',
        'The Calm': 'Versenkende Flut',
        'The Storm': 'Durch den Mahlstrom',
        'Tidal Rage': 'Wütende Flut',
        'Tidal Roar': 'Schrei der Gezeiten',
        'Tidal Wave': 'Flutwelle',
        '(?<! )Tsunami': 'Sturzflut',
        'Undersea Quake': 'Unterwasserbeben',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Leviathan': 'Léviathan',
      },
      'replaceText': {
        'Backbreaking Wave': 'Vague dévastatrice',
        'Black Smokers': 'Fumeurs noirs',
        '(?<!\\w)Breaking Wave': 'Vague brisante',
        'Drenching Pulse': 'Pulsation sauvage',
        'Freak Wave': 'Vague gigantesque',
        'Hot Water': 'Eau bouillante',
        'Hydrothermal Vent': 'Cheminées hydrothermales',
        'Killer Wave': 'Vague meurtrière',
        'Maelstrom': 'Maelström',
        'Monster Wave': 'Vague monstrueuse',
        'Plunging Wave': 'Vague plongeante',
        'Refreshing Shower': 'Éveil de l\'eau',
        'Rip Current': 'Courant d\'arrachement',
        'Roiling Pulse': 'Pulsation ravageuse',
        'Scouring Tsunami': 'Tsunami dévastateur',
        'Smothering Tsunami': 'Tsunami submergeant',
        'Spilling Wave': 'Vague déversante',
        'Spinning Dive': 'Piqué tournant',
        'Stormy Horizon': 'Mer déchaînée',
        'Sundering Tsunami': 'Tsunami fracturant',
        'Surging Tsunami': 'Tsunami écrasant',
        'Sweeping Tsunami': 'Tsunami pulvérisant',
        'Swirling Tsunami': 'Tsunami tournoyant',
        'Temporary Current': 'Courant évanescent',
        'The Calm': 'Onde naufrageuse',
        'The Storm': 'Spirale du chaos',
        'Tidal Rage': 'Furie des marées',
        'Tidal Roar': 'Vague rugissante',
        'Tidal Wave': 'Raz-de-marée',
        '(?<! )Tsunami': 'Tsunami',
        'Undersea Quake': 'Séisme sous-marin',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Leviathan': 'リヴァイアサン',
      },
      'replaceText': {
        'Backbreaking Wave': 'バックブレーキングウェイブ',
        'Black Smokers': 'ブラックスモーカー',
        '(?<!\\w)Breaking Wave': 'ブレーキングウェイブ',
        'Drenching Pulse': '猛烈なる波動',
        'Freak Wave': 'フリークウェイブ',
        'Hot Water': '熱水',
        'Hydrothermal Vent': 'ハイドロサーマルベント',
        'Killer Wave': 'キラーウェイブ',
        'Maelstrom': 'メイルシュトローム',
        'Monster Wave': 'モンスターウェイブ',
        'Plunging Wave': 'プランジングウェイブ',
        'Refreshing Shower': '水の覚醒',
        'Rip Current': 'リップカレント',
        'Roiling Pulse': '苛烈なる波動',
        'Scouring Tsunami': '暴風の大海嘯',
        'Smothering Tsunami': '溺没の大海嘯',
        'Spilling Wave': 'スピリングウェイブ',
        'Spinning Dive': 'スピニングダイブ',
        'Stormy Horizon': '大時化',
        'Sundering Tsunami': '断絶の大海嘯',
        'Surging Tsunami': '強圧の大海嘯',
        'Sweeping Tsunami': '拡散の大海嘯',
        'Swirling Tsunami': '渦動の大海嘯',
        'Temporary Current': 'テンポラリーカレント',
        'The Calm': '沈溺の波動',
        'The Storm': '混沌の渦動',
        'Tidal Rage': 'タイダルレイジ',
        'Tidal Roar': 'タイダルロア',
        'Tidal Wave': 'タイダルウェイブ',
        '(?<! )Tsunami': '大海嘯',
        'Undersea Quake': 'アンダーシークエイク',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Leviathan': '利维亚桑',
      },
      'replaceText': {
        'Backbreaking Wave': '返破碎波',
        'Black Smokers': '黑色烟柱',
        '(?<!\\w)Breaking Wave': '破碎波',
        'Drenching Pulse': '猛烈波动',
        'Freak Wave': '畸形波',
        'Hot Water': '热水',
        'Hydrothermal Vent': '海底热泉',
        'Killer Wave': '杀人浪',
        'Maelstrom': '巨漩涡',
        'Monster Wave': '疯狗浪',
        'Plunging Wave': '卷跃波',
        'Refreshing Shower': '水之觉醒',
        'Rip Current': '裂流',
        'Roiling Pulse': '剧烈波动',
        'Scouring Tsunami': '暴风大海啸',
        'Smothering Tsunami': '溺没大海啸',
        'Spilling Wave': '崩碎波',
        'Spinning Dive': '旋转下潜',
        'Stormy Horizon': '大暴风雨',
        'Sundering Tsunami': '断绝大海啸',
        'Surging Tsunami': '强压大海啸',
        'Sweeping Tsunami': '扩散大海啸',
        'Swirling Tsunami': '涡动大海啸',
        'Temporary Current': '临时洋流',
        'The Calm': '沉溺波动',
        'The Storm': '雷切',
        'Tidal Rage': '怒潮肆虐',
        'Tidal Roar': '怒潮咆哮',
        'Tidal Wave': '巨浪',
        '(?<! )Tsunami': '大海啸',
        'Undersea Quake': '海底地震',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Leviathan': '리바이어선',
      },
      'replaceText': {
        'Backbreaking Wave': '험난한 물결',
        'Black Smokers': '해저 간헐천',
        '(?<!\\w)Breaking Wave': '파괴의 물결',
        'Drenching Pulse': '맹렬한 파동',
        'Freak Wave': '기괴한 물결',
        'Hot Water': '열수',
        'Hydrothermal Vent': '열수 분출구',
        'Killer Wave': '치명적인 물결',
        'Maelstrom': '대격동',
        'Monster Wave': '마물의 물결',
        'Plunging Wave': '저돌적인 물결',
        'Refreshing Shower': '물의 각성',
        'Rip Current': '이안류',
        'Roiling Pulse': '가열찬 파동',
        'Scouring Tsunami': '폭풍의 대해일',
        'Smothering Tsunami': '익몰의 대해일',
        'Spilling Wave': '붕괴파',
        'Spinning Dive': '고속 돌진',
        'Stormy Horizon': '풍랑',
        'Sundering Tsunami': '단절의 대해일',
        'Surging Tsunami': '강압의 대해일',
        'Sweeping Tsunami': '확산의 대해일',
        'Swirling Tsunami': '와동의 대해일',
        'Temporary Current': '순간 해류',
        'The Calm': '익몰의 파동',
        'The Storm': '전멸기 / 혼돈의 파동',
        'Tidal Rage': '바다의 분노',
        'Tidal Roar': '바다의 포효',
        'Tidal Wave': '해일',
        '(?<! )Tsunami': '대해일',
        'Undersea Quake': '해저 지진',
      },
    },
  ],
};

export default triggerSet;
