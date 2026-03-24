import { createElement } from '../../../libs/framework';
import { ResultItem } from '../../train';

export function Result({ result }: { result: ResultItem[] }) {
  return (
    <div>
      <div className="grid grid-cols-2 gap-2 w-full items-center my-[10px]">
        <div className="font-extrabold">Pattern</div>{' '}
        <div className="font-extrabold ml-[5px]">Result</div>
      </div>
      {result.map((it) => (
        <div className="grid grid-cols-2 gap-2 w-full items-center my-[5px]">
          <div className="font-extrabold">{it.input}</div>{' '}
          <div className="ml-[5px]">{it.target}</div>
        </div>
      ))}
    </div>
  );
}
