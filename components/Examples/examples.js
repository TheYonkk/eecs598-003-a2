import Example from "./Example";

export const example1 = (
  <Example
    imageData={{
      url: "https://eecs583-yonkers-a2.s3.us-east-2.amazonaws.com/val2014/COCO_val2014_000000000074.jpg",
      width: 640/2,
      height: 426/2,
    }}
    question="What is the dog doing?"
    goodAnswers={["sleeping", "laying down"]}
    badAnswers={["walking (incorrect)", "the dog is sleeping (extra words)", "sleeping. (punctuation)", "the dog is sleeping on bricks (too much detail)"]}
  />
);

export const example2 = (
    <Example
      imageData={{
        url: "https://eecs583-yonkers-a2.s3.us-east-2.amazonaws.com/val2014/COCO_val2014_000000509822.jpg",
        width: 640/2,
        height: 425/2,
      }}
      question="Is this a comfortable bycicle?"
      goodAnswers={["yes", "no"]}
      badAnswers={["maybe (indecisive)", "I don't know (indecisive)", "N/A (indecisive)"]}
    />
  );

  export const example3 = (
    <Example
      imageData={{
        url: "https://eecs583-yonkers-a2.s3.us-east-2.amazonaws.com/val2014/COCO_val2014_000000568147.jpg",
        width: 480/2,
        height: 640/2,
      }}
      question="What color is the meter?"
      goodAnswers={["black"]}
      badAnswers={["black plastic (extra detail)", "black and grey (asked for color, not colors)", "pink (did not ask for the color of the pole)"]}
    />
  );
