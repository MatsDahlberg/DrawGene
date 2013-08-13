JavaScript for drawing a gene with exons and variations. Uses the D3js library.


The function takes 2 arguments.
graph = new SimpleGraph(sUrl, "chart1")

The second argument is a <div> in the HTML document where the graph will be placed.
The first argument is an URL to a web-service that returns a JSON in the followin format:

```
{
    "bp_end": 133446983, 
    "bp_start": 133320316, 
    "chr": "9", 
    "coverage": [], 
    "exons": [
        {
            "exon_id": "ENSE00001846144", 
            "start_bp": 133320316, 
            "stop_bp": 133320382
        }, 
        {
            "exon_id": "ENSE00001457679", 
            "start_bp": 133320349, 
            "stop_bp": 133320382
        }, 
        {
            "exon_id": "ENSE00001710321", 
            "start_bp": 133320375, 
            "stop_bp": 133320382
        }, 
        {
            "exon_id": "ENSE00001928823", 
            "start_bp": 133376363, 
            "stop_bp": 133376565
        }, 
        {
            "exon_id": "ENSE00001779659", 
            "start_bp": 133376363, 
            "stop_bp": 133376642
        }, 
        {
            "exon_id": "ENSE00001457680", 
            "start_bp": 133376363, 
            "stop_bp": 133376661
        }
    ], 
    "genes": [
        {
            "gene_end": 133376661, 
            "gene_name": "ASS1", 
            "gene_start": 133320316
        }
    ], 
    "variants": [
        [
            {
                "alt_nt": "T", 
                "functional_annotation": "-", 
                "gene": "ASS1", 
                "gene_model": "AR_compound;AR_denovo;AR;", 
                "rank_score": 10, 
                "ref_nt": "A", 
                "start_bp": 133364632, 
                "stop_bp": 133364632, 
                "type": "intronic", 
                "variantid": 1627432
            }, 
        [
            {
                "alt_nt": "G", 
                "functional_annotation": "-", 
                "gene": "ASS1", 
                "gene_model": "AR_compound;AR_denovo;AR;", 
                "rank_score": -5, 
                "ref_nt": "A", 
                "start_bp": 133346983, 
                "stop_bp": 133346983, 
                "type": "intronic", 
                "variantid": 1627748
            }, 
            [
                {
                    "ad": "0,53", 
                    "dp": null, 
                    "filter": "PASS", 
                    "gq": 99, 
                    "gt": "1/1", 
                    "idn": "1-1-3A", 
                    "pl": "1731,157,0"
                }, 
                {
                    "ad": "0,61", 
                    "dp": null, 
                    "filter": "PASS", 
                    "gq": 99, 
                    "gt": "1/1", 
                    "idn": "1-1-4A", 
                    "pl": "2017,185,0"
                }
            ]
        ], 
            [
                {
                    "ad": "0,85", 
                    "dp": null, 
                    "filter": "PASS", 
                    "gq": 99, 
                    "gt": "1/1", 
                    "idn": "1-1-3A", 
                    "pl": "5491,454,0"
                }, 
                {
                    "ad": "0,94", 
                    "dp": null, 
                    "filter": "PASS", 
                    "gq": 99, 
                    "gt": "1/1", 
                    "idn": "1-1-4A", 
                    "pl": "5346,451,0"
                }
            ]
        ], 
        [
            {
                "alt_nt": "T", 
                "functional_annotation": "-", 
                "gene": "ASS1", 
                "gene_model": "AR_compound;AR_denovo;AR;", 
                "rank_score": -7, 
                "ref_nt": "C", 
                "start_bp": 133346379, 
                "stop_bp": 133346379, 
                "type": "intronic", 
                "variantid": 1628064
            }, 
            [
                {
                    "ad": "0,23", 
                    "dp": null, 
                    "filter": "PASS", 
                    "gq": 71, 
                    "gt": "1/1", 
                    "idn": "1-1-3A", 
                    "pl": "736,71,0"
                }, 
                {
                    "ad": "0,20", 
                    "dp": null, 
                    "filter": "PASS", 
                    "gq": 59, 
                    "gt": "1/1", 
                    "idn": "1-1-4A", 
                    "pl": "636,59,0"
                }
            ]
        ], 
        [
            {
                "alt_nt": "G", 
                "functional_annotation": "-", 
                "gene": "ASS1", 
                "gene_model": "AR_compound;AR_denovo;AR;", 
                "rank_score": -7, 
                "ref_nt": "A", 
                "start_bp": 133355874, 
                "stop_bp": 133355874, 
                "type": "intronic", 
                "variantid": 1628066
            }, 
            [
                {
                    "ad": "0,39", 
                    "dp": null, 
                    "filter": "PASS", 
                    "gq": 99, 
                    "gt": "1/1", 
                    "idn": "1-1-3A", 
                    "pl": "2769,215,0"
                }, 
                {
                    "ad": "0,31", 
                    "dp": null, 
                    "filter": "PASS", 
                    "gq": 99, 
                    "gt": "1/1", 
                    "idn": "1-1-4A", 
                    "pl": "2212,166,0"
                }
            ]
        ], 
        [
            {
                "alt_nt": "A", 
                "functional_annotation": "-", 
                "gene": "ASS1", 
                "gene_model": "AR_compound;AD_denovo;AD;", 
                "rank_score": -7, 
                "ref_nt": "C", 
                "start_bp": 133355902, 
                "stop_bp": 133355902, 
                "type": "intronic", 
                "variantid": 1628091
            }, 
            [
                {
                    "ad": "21,19", 
                    "dp": null, 
                    "filter": "PASS", 
                    "gq": 99, 
                    "gt": "0/1", 
                    "idn": "1-1-3A", 
                    "pl": "534,0,589"
                }, 
                {
                    "ad": "13,18", 
                    "dp": null, 
                    "filter": "PASS", 
                    "gq": 99, 
                    "gt": "0/1", 
                    "idn": "1-1-4A", 
                    "pl": "478,0,304"
                }
            ]
        ]
    ]
}
```
