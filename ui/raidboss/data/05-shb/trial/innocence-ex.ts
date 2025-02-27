import Conditions from '../../../../../resources/conditions';
import Outputs from '../../../../../resources/outputs';
import { Responses } from '../../../../../resources/responses';
import ZoneId from '../../../../../resources/zone_id';
import { RaidbossData } from '../../../../../types/data';
import { TriggerSet } from '../../../../../types/trigger';

export interface Data extends RaidbossData {
  starbirthCount?: number;
  starbirthActive?: boolean;
  lightPillar?: number;
}

// Innocence Extreme
const triggerSet: TriggerSet<Data> = {
  zoneId: ZoneId.TheCrownOfTheImmaculateExtreme,
  timelineFile: 'innocence-ex.txt',
  triggers: [
    {
      id: 'InnoEx Starbirth Count',
      type: 'StartsUsing',
      netRegex: { id: '3EEF', source: 'Innocence', capture: false },
      run: (data) => {
        data.starbirthCount = (data.starbirthCount ?? 0) + 1;
        data.starbirthActive = true;
      },
    },
    {
      id: 'InnoEx Reprobation Swords 2',
      type: 'StartsUsing',
      netRegex: { id: '3EDC', source: 'Innocence', capture: false },
      // 3 seconds cast time + 7 seconds until next sword.
      delaySeconds: 7,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Swords!',
          de: 'Schwerter!',
          fr: 'Épées !',
          ja: '剣くるよ',
          cn: '剑!',
          ko: '검 돌아옴!',
        },
      },
    },
    {
      id: 'InnoEx Starbirth Warning',
      type: 'StartsUsing',
      netRegex: { id: '3EEF', source: 'Innocence', capture: false },
      infoText: (data, _matches, output) => {
        if (data.starbirthCount === 1)
          return output.starbirthCorner!();
        else if (data.starbirthCount === 2 || data.starbirthCount === 5)
          return output.starbirthAvoidCharge!();
        else if (data.starbirthCount === 3)
          return output.starbirthExplode!();
        else if (data.starbirthCount === 4)
          return output.starbirthCharge!();
        else if (data.starbirthCount === 6)
          return output.starbirthEnrage!();

        // No text for the second enrage one.
      },
      outputStrings: {
        starbirthCorner: {
          en: 'Starbirth: Corner',
          de: 'Sternengeburt: Ecken',
          fr: 'Accouchement Stellaire : Coin',
          ja: 'スターバース: 角へ',
          cn: '创星：角落躲避',
          ko: '별생성: 구석으로',
        },
        starbirthAvoidCharge: {
          en: 'Starbirth: Avoid + Charge',
          de: 'Sternengeburt: Ausweichen + Charge',
          fr: 'Accouchement Stellaire : Évitez + Charge',
          ja: 'スターバース: 玉のない隅へ',
          cn: '创星：躲避 + 冲锋',
          ko: '별 생성: 별 피해서 징 맞기 + 돌진',
        },
        starbirthExplode: {
          en: 'Starbirth: Explode',
          de: 'Sternengeburt: Explosion',
          fr: 'Accouchement Stellaire : Explosion',
          ja: 'スターバース: 爆発',
          cn: '创星：爆炸',
          ko: '별 생성: 별 터뜨리기',
        },
        starbirthCharge: {
          en: 'Starbirth: Charge',
          de: 'Sternengeburt: Charge',
          fr: 'Accouchement Stellaire : Charge',
          ja: 'スターバース: 突進',
          cn: '创星：冲锋',
          ko: '별 생성: 돌진',
        },
        starbirthEnrage: {
          en: 'Starbirth: Enrage',
          de: 'Sternengeburt: Finalangriff',
          fr: 'Accouchement Stellaire : Enrage',
          ja: 'スターバース: 時間切れ',
          cn: '创星：狂暴',
          ko: '별 생성: 전멸기',
        },
      },
    },
    {
      id: 'InnoEx Shadowreaver',
      type: 'StartsUsing',
      netRegex: { id: '3EEA', source: 'Innocence', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'InnoEx Righteous Bolt',
      type: 'StartsUsing',
      netRegex: { id: '3ECD', source: 'Innocence' },
      response: Responses.tankBusterSwap(),
    },
    {
      id: 'InnoEx Holy Sword Healer',
      type: 'StartsUsing',
      netRegex: { id: '3EC9', source: 'Forgiven Venery', capture: false },
      suppressSeconds: 5,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: Outputs.tankBusters,
      },
    },
    {
      id: 'InnoEx Holy Sword Me',
      type: 'StartsUsing',
      netRegex: { id: '3EC9', source: 'Forgiven Venery' },
      condition: Conditions.targetIsYou(),
      response: Responses.tankBuster(),
    },
    {
      id: 'InnoEx Charge',
      type: 'StartsUsing',
      netRegex: { id: '3EEE', source: 'Innocence', capture: false },
      alertText: (data, _matches, output) => {
        if (data.starbirthActive)
          return output.avoidChargeAndOrbs!();

        return output.avoidCharge!();
      },
      outputStrings: {
        avoidChargeAndOrbs: {
          en: 'Avoid Charge and Orbs',
          de: 'Charge und Orbs ausweichen',
          fr: 'Évitez les charges et les orbes',
          ja: '玉と突進避けて',
          cn: '躲避冲锋与晶石',
          ko: '돌진이랑 구슬 폭발을 피하세요',
        },
        avoidCharge: {
          en: 'Avoid Charge',
          de: 'Charge ausweichen',
          fr: 'Évitez les charges',
          ja: '突進避けて',
          cn: '躲避冲锋',
          ko: '돌진을 피하세요',
        },
      },
    },
    {
      id: 'InnoEx Starbirth Avoid',
      type: 'StartsUsing',
      netRegex: { id: '3EEF', source: 'Innocence', capture: false },
      condition: (data) => data.starbirthCount === 1,
      delaySeconds: 6,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Get to Safe Corner',
          de: 'Geh in die sichere Ecke',
          fr: 'Allez au coin safe',
          ja: '安置へ',
          cn: '去安全角落',
          ko: '안전한 구석으로 이동',
        },
      },
    },
    {
      id: 'InnoEx Adds',
      type: 'Ability',
      netRegex: { id: '42B0', source: 'Innocence', capture: false },
      condition: (data) => data.role === 'tank',
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Grab East/West Venery Adds',
          de: 'Nehme östliches/westliches Wollust Add',
          fr: 'Attrapez les adds en Est/Ouest',
          ja: '雑魚のタゲ取って',
          cn: '接小怪仇恨',
          ko: '동/서 쫄 잡으세요',
        },
      },
    },
    {
      id: 'InnoEx Light Pillar',
      type: 'Ability',
      netRegex: { id: '38FC', source: 'Innocence' },
      preRun: (data) => data.lightPillar = (data.lightPillar ?? 0) + 1,
      alarmText: (data, matches, output) => {
        if (matches.target !== data.me)
          return;

        if (data.lightPillar === 3)
          return output.aimLineAtBackOrb!();

        return output.avoidOrbsWithLine!();
      },
      infoText: (data, matches, output) => {
        if (matches.target === data.me)
          return;
        return output.lineStack!();
      },
      outputStrings: {
        lineStack: {
          en: 'Line Stack',
          de: 'Sammeln in einer Linie',
          fr: 'Packez-vous en ligne',
          ja: 'シェア',
          cn: '直线分摊',
          ko: '쉐어징 모이세요',
        },
        aimLineAtBackOrb: {
          en: 'Aim Line At Back Orb',
          de: 'Ziehle mit der Linie auf den entferntesten Orb',
          fr: 'Visez avec la ligne à l\'arrière de l\'orbe',
          ja: '後ろの玉に当てて',
          cn: '分摊瞄准后方晶石',
          ko: '멀리 있는 구슬 하나 맞추세요',
        },
        avoidOrbsWithLine: {
          en: 'Avoid Orbs With Line',
          de: 'Ziehle nicht auf einen Orb',
          fr: 'Évitez l\'orbe avec la ligne',
          ja: '玉に当てるな',
          cn: '躲开晶石与直线',
          ko: '쉐어징이 구슬에 맞지 않게 하세요',
        },
      },
    },
    {
      id: 'InnoEx Starbirth Explode',
      type: 'StartsUsing',
      netRegex: { id: '3F3E', source: 'Innocence', capture: false },
      condition: (data) => data.lightPillar === 3,
      delaySeconds: 6.5,
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Get to Safe Corner',
          de: 'Geh in die sichere Ecke',
          fr: 'Allez au coin safe',
          ja: '安置へ',
          cn: '去安全角落',
          ko: '안전한 구석으로 이동하세요',
        },
      },
    },
    {
      id: 'InnoEx Winged Reprobation Tether',
      type: 'HeadMarker',
      netRegex: { id: '00AC' },
      condition: Conditions.targetIsYou(),
      alertText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Tether on YOU',
          de: 'Verbindung auf DIR',
          fr: 'Lien sur VOUS',
          ja: '線ついた',
          cn: '连线点名',
          ko: '선 대상자 지정됨',
        },
      },
    },
    {
      id: 'InnoEx Winged Drop Of Light',
      type: 'HeadMarker',
      netRegex: { id: '008A' },
      condition: Conditions.targetIsYou(),
      alertText: (data, _matches, output) => {
        if (data.starbirthActive)
          return output.circleAvoidOrbs!();

        return output.circleOnYou!();
      },
      outputStrings: {
        circleAvoidOrbs: {
          en: 'Circle, Avoid Orbs',
          de: 'Kreis, vermeide Orbs',
          fr: 'Cercle, Évitez les orbes',
          ja: 'オーブに当てないで',
          cn: '圆圈点名，远离晶石',
          ko: '원형 징, 구슬 피하세요',
        },
        circleOnYou: {
          en: 'Circle on YOU',
          de: 'Kreis auf DIR',
          fr: 'Cercle sur vous',
          ja: 'サークルついた',
          cn: '圆圈点名',
          ko: '원형 징 대상자 지정됨',
        },
      },
    },
    {
      id: 'InnoEx God Ray',
      type: 'StartsUsing',
      netRegex: { id: '3EE[456]', source: 'Innocence', capture: false },
      suppressSeconds: 15,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Avoid Swords then Ray',
          de: 'Weiche den Schwertern aus, danach Strahl',
          fr: 'Évitez l\'épée puis le rayon',
          ja: '剣避けてからピザカット',
          cn: '躲避剑与激光',
          ko: '칼 먼저 피하고 장판 피하세요',
        },
      },
    },
    {
      id: 'InnoEx Starbirth End 1',
      type: 'StartsUsing',
      netRegex: { id: '3EEA', source: 'Innocence', capture: false },
      run: (data) => delete data.starbirthActive,
    },
    {
      id: 'InnoEx Starbirth End 2',
      type: 'StartsUsing',
      netRegex: { id: '3EEE', source: 'Innocence', capture: false },
      run: (data) => delete data.starbirthActive,
    },
    {
      id: 'InnoEx Soul And Body Left',
      type: 'StartsUsing',
      netRegex: { id: '3ED7', source: 'Innocence', capture: false },
      suppressSeconds: 1,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Rotate Left',
          de: 'Links rum rotieren',
          fr: 'Tournez vers la gauche',
          ja: '時針回り',
          cn: '向左旋转',
          ko: '왼쪽으로 도세요',
        },
      },
    },
    {
      id: 'InnoEx Soul And Body Right',
      type: 'StartsUsing',
      netRegex: { id: '3ED9', source: 'Innocence', capture: false },
      suppressSeconds: 1,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Rotate Right',
          de: 'Rechts rum rotieren',
          fr: 'Tournez vers la droite',
          ja: '逆時針回り',
          cn: '向右旋转',
          ko: '오른쪽으로 도세요',
        },
      },
    },
    {
      id: 'InnoEx Rood Left',
      type: 'StartsUsing',
      netRegex: { id: '3ED3', source: 'Innocence', capture: false },
      suppressSeconds: 1,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Rotate Left',
          de: 'Links rum rotieren',
          fr: 'Tournez vers la gauche',
          ja: '時針回り',
          cn: '向左旋转',
          ko: '왼쪽으로 도세요',
        },
      },
    },
    {
      id: 'InnoEx Rood Right',
      type: 'StartsUsing',
      netRegex: { id: '3ED5', source: 'Innocence', capture: false },
      suppressSeconds: 1,
      infoText: (_data, _matches, output) => output.text!(),
      outputStrings: {
        text: {
          en: 'Rotate Right',
          de: 'Rechts rum rotieren',
          fr: 'Tournez vers la droite',
          ja: '逆時針回り',
          cn: '向右旋转',
          ko: '오른쪽으로 도세요',
        },
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Innocence': 'Innozenz',
        'Nail of Condemnation': 'Nagel des Urteils',
        'Sword of Condemnation': 'Schwert des Urteils',
        'Forgiven Venery': 'Geläutert(?:e|er|es|en) Wollust',
        'Forgiven Shame': 'Geläuterte Schande',
      },
      'replaceText': {
        'Tethers': 'Verbindungen',
        'Rotate': 'Rotieren',
        'Trident': 'Dreizack',
        'Charge': 'Ansturm',
        'Corner': 'Ecke',
        'Explode': 'Explosion',
        'Avoid': 'ausweichen',
        'Final(?!angriff)': ' Finale',
        'Soul And Body': 'Seele und Körper',
        'Shadowreaver': 'Schattenplünderer',
        'Scold\'s Bridle': 'Schandmal',
        'Rightful Reprobation': 'Rechtmäßige Verurteilung',
        'Righteous Bolt': 'Blitz der Gerechtigkeit',
        '(?<! )Reprobation': 'Verurteilung',
        'Light Pillar': 'Lichtsäule',
        'Holy Trinity': 'Heilige Dreifaltigkeit',
        'Holy Sword': 'Heiliges Schwert',
        'Guiding Light': 'Leitendes Licht',
        'God Ray': 'Göttlicher Strahl',
        'Explosion': 'Explosion',
        'Duel Descent': 'Doppelter Sinkflug',
        'Beatific Vision': 'Seligmachende Schau',
        'Forgiven venery': 'Geläuterte Wollust',
        'Drop Of Light': 'Lichtabfall',
        'Winged Rep': 'Schwinge des Urteils',
        'Starbirth': 'Sternengeburt',
      },
    },
    {
      'locale': 'fr',
      'replaceSync': {
        'Sword of Condemnation': 'Épée De Condamnation',
        'Nail of Condemnation': 'Clou De Condamnation',
        'Forgiven Venery': 'Débauche Pardonnée',
        'Forgiven Shame': 'Déshonneur Pardonné',
        'Innocence': 'Innocence',
      },
      'replaceText': {
        'Winged Rep Trident': 'Trident ailée',
        'Winged Rep Tethers': 'Liens ailée',
        'Winged Rep Rotate': 'Rotation ailée',
        'Starbirth Final': 'Accouchement stellaire final',
        'Starbirth Explode': 'Accouchement stellaire explose',
        'Starbirth Corner': 'Accouchement stellaire au coin',
        'Starbirth Charge': 'Accouchement stellaire charge',
        'Starbirth Avoid': 'Accouchement stellaire à éviter',
        'Soul And Body': 'Âme et corps',
        'Shadowreaver': 'Pilleur d\'ombre',
        'Scold\'s Bridle': 'Bride-bavarde',
        'Rightful Reprobation': 'Réprobation légitime',
        'Righteous Bolt': 'Éclair vertueux',
        '(?<! )Reprobation': 'Réprobation',
        'Light Pillar': 'Pilier de lumière',
        'Holy Trinity': 'Sainte Trinité',
        'Holy Sword': 'Épée sacrée',
        'Guiding Light': 'Lumière directrice',
        'God Ray': 'Rayon divin',
        'Explosion': 'Explosion',
        'Duel Descent': 'Double plongeon',
        'Drop Of Light': 'Goutte de lumière',
        'Beatific Vision': 'Vision béatifique',
        'Forgiven venery': 'débauche pardonnée',
      },
    },
    {
      'locale': 'ja',
      'replaceSync': {
        'Sword of Condemnation': '断罪の剣',
        'Innocence': 'イノセンス',
        'Nail of Condemnation': '断罪の杭',
        'Forgiven Shame': 'フォーギヴン・シェイム',
        'Forgiven Venery': 'フォーギヴン・ヴェナリー',
      },
      'replaceText': {
        'Winged Rep Tethers': '断罪の飛翔：線',
        'Winged Rep Rotate': '断罪の飛翔：回転',
        'Winged Rep Trident': '断罪の飛翔：AoE',
        'Starbirth Corner': 'スターバース: 角へ',
        'Starbirth Avoid': 'スターバース: 玉のない隅へ',
        'Starbirth Charge': 'スターバース: 突進',
        'Starbirth Explode': 'スターバース: 爆発',
        'Starbirth Final': 'スターバース: 時間切れ',
        'Soul And Body': 'ソウル・アンド・ボディー',
        'Shadowreaver': 'シャドウリーヴァー',
        'Scold\'s Bridle': 'スコルドブライダル',
        'Rightful Reprobation': '断罪の旋回',
        'Righteous Bolt': 'ジャッジボルト',
        '(?<! )Reprobation': '断罪',
        'Light Pillar': 'ライトピラー',
        'Holy Trinity': 'ホーリートリニティー',
        'Holy Sword': 'ホーリーソード',
        'Guiding Light': 'ガイディングライト',
        'God Ray': 'ゴッドレイ',
        'Explosion': '爆散',
        'Duel Descent': 'デュアルディセント',
        'Drop Of Light': 'ドロップ・オブ・ライト',
        'Beatific Vision': 'ビーティフィックビジョン',
        'Forgiven venery': 'フォーギヴン・ヴェナリー',
      },
    },
    {
      'locale': 'cn',
      'replaceSync': {
        'Sword of Condemnation': '断罪之剑',
        'Innocence': '无瑕灵君',
        'Nail of Condemnation': '断罪之桩',
        'Forgiven Shame': '得到宽恕的耻辱',
        'Forgiven Venery': '得到宽恕的情欲',
      },
      'replaceText': {
        'Winged Rep Trident': '扇形断罪飞翔',
        'Winged Rep Rotate': '风车断罪飞翔',
        'Winged Rep Tethers': '连线断罪飞翔',
        'Starbirth Corner': '创星角落',
        'Starbirth Avoid': '创星躲避',
        'Starbirth Charge': '创星突进',
        'Starbirth Explode': '创星爆炸',
        'Starbirth Final': '创星狂暴',
        'Soul And Body': '身心',
        'Shadowreaver': '夺影',
        'Scold\'s Bridle': '毒舌钩',
        'Rightful Reprobation': '断罪回旋',
        'Righteous Bolt': '裁决之雷',
        '(?<! )Reprobation': '断罪',
        'Light Pillar': '光明柱',
        'Holy Trinity': '圣三一',
        'Holy Sword': '神圣剑',
        'Guiding Light': '指明灯',
        'God Ray': '神光',
        'Explosion': '爆炸',
        'Duel Descent': '斗争降临',
        'Drop Of Light': '落光',
        'Beatific Vision': '荣福直观',
        'Forgiven venery': '得到宽恕的情欲',
      },
    },
    {
      'locale': 'ko',
      'replaceSync': {
        'Innocence': '이노센스',
        'Nail of Condemnation': '단죄의 말뚝',
        'Sword of Condemnation': '단죄의 검',
        'Forgiven Venery': '면죄된 정욕',
        'Forgiven Shame': '면죄된 수치',
      },
      'replaceText': {
        'Winged Rep Trident': '단죄의 비상 직선장판',
        'Winged Rep Rotate': '단죄의 비상 회전',
        'Winged Rep Tethers': '단죄의 비상 줄연결',
        'Starbirth': '별 생성',
        'Soul And Body': '영혼과 육신',
        'Shadowreaver': '그림자 강탈',
        'Scold\'s Bridle': '입막음 굴레',
        'Rightful Reprobation': '단죄의 선회',
        'Righteous Bolt': '심판자의 번개',
        '(?<! )Reprobation': '선회',
        'Light Pillar': '빛의 기둥',
        'Holy Trinity': '성 삼위일체',
        'Holy Sword': '성스러운 검',
        'Guiding Light': '인도하는 빛',
        'God Ray': '신의 광선',
        'Explosion': '폭산',
        'Duel Descent': '이단 낙하',
        'Drop Of Light': '빛내림',
        'Beatific Vision': '지복직관',
        'Forgiven venery': '면죄된 정욕',
        ' Avoid': ' (피하기)',
        ' Explode': ' (터뜨리기)',
        ' Charge': ' (돌진)',
        ' Final': ' (마지막)',
      },
    },
  ],
};

export default triggerSet;
