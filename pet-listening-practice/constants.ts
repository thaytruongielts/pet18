import { QuestionPart } from './types';

export const RAW_TEXT = `The hotel provided excellent (1)__________ for our family during the trip. You must show your (2)__________ to the attendant before getting on the plane. We apologized for the slight (3)__________ due to heavy traffic. Paris is a very popular tourist (4)__________ for people from all over the world. The school organized a fun (5)__________ to the local history museum. The bus (6)__________ has increased by 10% this year. Please keep an eye on your (7)__________ while waiting at the station. The train to London departs from (8)__________ number five. I made a (9)__________ for dinner at the Italian restaurant at 7 PM. Which (10)__________ should we take to avoid the traffic jam in the city center? I have to finish this difficult math (11)__________ by next Monday. The best (12)__________ will get the job offer tomorrow morning. She wants to pursue a successful (13)__________ in digital marketing. My (14)__________ helped me finish the project on time. He studied hard for four years to get a university (15). She works in the sales (16) of a large company. I was very nervous during my job (17), but I think I did well. You need a teaching (18) to work at this international school. Students should do some (19)__________ every day before the final exam. The company offers a competitive monthly (20)__________ and good benefits. I cannot (21)__________ to buy a new car right now because it is too expensive. I looked through the shopping (22)__________ to find a gift for my mother. Students can get a 10% (23)__________ at this bookstore. There are many forms of (24)__________ in the city, such as cinemas and theaters. We visited an art (25)__________ last weekend and saw many beautiful paintings. The music (26)__________ attracts thousands of young people every summer. Do we have all the fresh (27)__________ needed to make the salad? In my (28)__________ time, I enjoy reading books and gardening. The actor gave a wonderful (29)__________ on stage last night. Can you share your secret cake (30)__________ with me? The (31)__________ in this country is generally warm and wet throughout the year. The weather (32)__________ predicts heavy rain for tomorrow afternoon. It is (33)__________ outside, so please wear a warm coat and gloves. The storm brought heavy rain and loud (34)__________ last night. Air (35)__________ is a serious problem in many big cities nowadays. We should (36)__________ paper and plastic bottles to protect the environment. This (37)__________ is famous for its beautiful mountains and lakes. The mountain (38)__________ was absolutely breathtaking from the top. The (39)__________ dropped significantly during the night. The national park protects the local (40)__________ and their habitats. They called an (41)__________ immediately after the accident happened. I have a dental (42)__________ at 3 o'clock this afternoon. She felt (43)__________ that she would pass the driving test. In case of an (44), please dial 112 for help. Running is great for improving your overall (45) and health. The player was (46)__________ during the football match and had to leave the field. The doctor gave him some bitter (47)__________ to take after meals. He needs a minor (48)__________ on his knee next week. You can only get these pills with a doctor's (49)      . It took him two weeks to fully (50)        from the flu.`;

export const SOUNDCLOUD_SRC = "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/soundcloud%253Atracks%253A2225440274&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true";

export const parseTextToSegments = (text: string): QuestionPart[] => {
  // Regex to match (number) followed by optional underscores/spaces
  // Matches: (1)_____, (1), (15)
  const regex = /\((\d+)\)[_\s]*/g;
  const parts: QuestionPart[] = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Text before the blank
    const beforeText = text.slice(lastIndex, match.index);
    if (beforeText) {
      parts.push({ text: beforeText, isBlank: false });
    }

    // The blank itself
    parts.push({ 
      id: parseInt(match[1], 10), 
      text: '', 
      isBlank: true 
    });

    lastIndex = regex.lastIndex;
  }

  // Remaining text
  if (lastIndex < text.length) {
    parts.push({ text: text.slice(lastIndex), isBlank: false });
  }

  return parts;
};